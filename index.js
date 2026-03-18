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
    if (message.author.id === process.env.BOT_USER_ID) return;
    if (message.channelId !== process.env.SOURCE_CHANNEL_ID) return;
    // 指定した速報メッセージが含まれていたら別チャンネルに転送
    if (
        message.content.includes("GALAXYウスイのメガなな速報") ||
        message.content.includes("ファンキーサトウのメガいち速報")
    ) {
        const targetChannel = client.channels.cache.get(process.env.TARGET_CHANNEL_ID);
        if (targetChannel) {
            targetChannel.send(`${message.content}`);
        }
    }
});

// 以下にトークンの貼り付け
client.login(process.env.DISCORD_TOKEN);