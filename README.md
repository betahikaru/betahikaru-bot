# @betahikaru-bot

## @betahikaru-botとは
- Twitterボットの習作。
- Node.jsのnode-twitterモジュールを使って実現している。


## 開発中の機能
- 単語に反応してフォロー、リムーブ
- //おうむ返し（リプライが来たらそのまま返す）
- //単語に反応してツイート（ホームラインを監視して登録用語がきたらツイート）


### 参考サイト
1. [Twitter - REST API v1.1 Resources](https://dev.twitter.com/docs/api/1.1)
2. [Node.jsで作るTwitterボット制作](http://t.co/s388QaU6tT)


## 使い方

- ```git clone```する
- twitterAccount.jsonファイルを作る

```json:twitterAccount.json
{
	"consumer_key"			: "ここにアカウントの情報を入力",
	"consumer_secret"		: "同上",
	"access_token_key"		: "同上",
	"access_token_secret"	: "同上"
}
```
- ```sudo npm install``` する
- follow.jsを使う場合は、変数```BOT_SCREEN_NAME```に自分のTwitterアカウントのscreen_nameを設定する。
- ``` node follow.js ``` する

## 備考
### Twitterアイコン
- [フリー素材](http://www.material-land.com/view__1769__0.html)を利用しています

### Twitter APIのkey,secretはリポジトリに登録してない

- key,secretはJSONファイルに外だしして、.gitignoreでgitの管理外にする
- 外だししたJSONファイルを読み込む



```javascript:twitterAccount.json
var twitter = require('twitter'),
    fs = require('fs');

var keyandsecrets = JSON.parse(fs.readFileSync(__dirname + '/twitterAccount.json'));
var bot = new twitter(keyandsecrets);
```




