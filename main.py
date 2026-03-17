import asyncio
import os
from twikit import Client
import requests

# Secretsから設定を読み込み
USERNAME = os.getenv('X_USERNAME')
EMAIL = os.getenv('X_EMAIL')
PASSWORD = os.getenv('X_PASSWORD')
WEBHOOK = os.getenv('DISCORD_WEBHOOK')
TARGET = '999999Q9Q'

async def main():
    client = Client('ja-JP')
    # ログイン（クッキー保存などは簡略化しています）
    await client.login(auth_info_1=USERNAME, auth_info_2=EMAIL, password=PASSWORD)
    
    # ターゲットのツイート取得
    user = await client.get_user_by_screen_name(TARGET)
    tweets = await client.get_user_tweets(user.id, 'Tweets')

    if not tweets:
        return

    # 最新ツイート（1件目）を確認
    latest = tweets[0]
    
    # 「速報」が含まれているか判定
    if "速報" in latest.text:
        # 重複通知防止のため、本来はIDを保存すべきですが
        # 簡易版として、15分以内の投稿なら送信するロジックなどが望ましいです
        msg = f"【速報】{TARGET}さんが投稿しました：\n{latest.text}\nhttps://x.com/{TARGET}/status/{latest.id}"
        requests.post(WEBHOOK, json={"content": msg})

if __name__ == '__main__':
    asyncio.run(main())