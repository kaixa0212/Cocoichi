require('dotenv').config();

const express = require('express');
const app = express();

// Renderからのアクセスを受け付けるポート設定
app.get('/', (req, res) => {
    res.send('Bot is running!');
});

app.listen(3000, () => {
    console.log('Web server is ready.');
});

const { Client, GatewayIntentBits } = require('discord.js');

// 転送先チャンネルのIDを指定（ここに実際のチャンネルIDを入れてください）
const targetChannelId = '1483447787465998336';

// Botのクライアントを作成
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,           
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent 
    ]
});

// 起動時の処理
client.once('ready', () => {
    console.log(`${client.user.tag} としてログインしました`);
});

// メッセージを受け取った時の処理
client.on('messageCreate', message => {
    // Bot自身の発言は無視する
    if (message.author.bot) return;

    // 「こんにちは」と来たら「こんにちは！」と返す
    if (message.content === "こんにちは") {
        message.channel.send('こんにちは！');
    }

    // 「速報」が含まれていたら別チャンネルに転送
    if (message.content.includes("速報")) {
        const targetChannel = client.channels.cache.get(targetChannelId);
        if (targetChannel) {
            targetChannel.send(`${message.content}`);
        }
    }
});

// 以下にトークンの貼り付け
client.login(process.env.DISCORD_TOKEN);