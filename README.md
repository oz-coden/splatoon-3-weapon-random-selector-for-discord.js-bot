# Splatoon 3 Weapon Random Selector for Discord Bot Randomizer

Splatoon 3 Ver. 11.2.0対応の、ブキをランダムに選んでくれるNode.jsで動作するDiscord Botです。

## 機能

- `/wrs` : ブキをランダムに1つ選びます。
  - **オプション機能**: `mode` を指定することで、「シューター限定」「ローラー限定」など、特定のカテゴリから絞り込んで選ぶことができます。
- `/ping` : Botの現在の応答速度（Ping値）をミリ秒で確認します。（おまけ）

## 環境

以下の環境が必要です。

- **Node.js**: v18以上
- **Discord Bot Token**: Discord Developer Portal から取得したトークン

## 導入方法

Node.jsの環境が必要です。
それを用意した後は、リポジトリにあるファイルを使用し、packageの情報に従って必要なパッケージをダウンロードします。
.envにDiscordのTOKEN情報を記載します。
