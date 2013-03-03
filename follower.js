var util = require('util')
,	twitter = require('twitter')
,	printf = require('printf')
,	fs = require('fs')
	;

var keyandsecrets = JSON.parse(fs.readFileSync(__dirname + '/twitterAccount.json'));
var bot = new twitter(keyandsecrets);

var BOT_SCREEN_NAME = 'betahikaru_dev';

var followTweets = [
	'フォロー'
	,'follow'
];
var removeTweets = [
	'リムーブ'
	,'remove'
];

// キャッチされない例外があった場合の救済措置
process.on('uncaughtException', function(err) {
	console.error('[FATAL]uncaughtException => ' + err);
});

// botのタイムラインを監視
bot.stream('user', function(stream) {
	stream.on('data', function(data) {
		// ツイートにはtextがある。ツイート以外の場合は終了
		if ( !('text' in data)
			|| !('user' in data)
			|| !('screen_name' in data.user)
			) {
			console.error('[ERROR] invalid data');
			return;
		}

		// 自分のツイートの場合は終了
		if (data.user.screen_name === BOT_SCREEN_NAME) { return; }

		console.log(data);

		// Mention(@)だったらtrue
		var isMention = ('in_reply_to_screen_name' in data) ?
					data.in_reply_to_screen_name !== null : false;
		// var 

		// followのパターンと一致したらtrue
		var isFollow = false;
		// removeのパターンと一致したらtrue
		var isRemove = false;

		// リストに登録したフォローTweetのパターンを検証
		for (var index in followTweets) {
			var test = false;
			try {
				console.log("[DEBUG]Test. data.text -> " + data.text
					+ "followTweets[index] -> " + followTweets[index]
					);

				test = new RegExp(followTweets[index]).test(data.text);
				isFollow = isFollow || test;
				console.log("[DEBUG]Test. "
					+ ", test -> " + test
					+ ", isFollow -> " + isFollow
					);
			} catch (ex) {
				console.error(ex);
				continue;
			}
		}
		// リストに登録したフォローTweetのパターンを検証
		for (var index in removeTweets) {
			var test = false;
			try {
				console.log("[DEBUG]Test. data.text -> " + data.text
					+ "removeTweets[index] -> " + removeTweets[index]
					);

				test = new RegExp(removeTweets[index]).test(data.text);
				isRemove = isRemove || test;
				console.log("[DEBUG]Test. "
					+ ", test -> " + test
					+ ", isFollow -> " + isFollow
					);
			} catch (ex) {
				console.error(ex);
				continue;
			}
		}

		if (isFollow) {
			var tweetStr = printf('@%s さん、フォローするよ。リムーブしてほしい時はそう言ってね。 %s'
				, data.user.screen_name
				, new Date()
				);

			// 5秒後にツイート
			console.log("[INFO]Tweet!");
			setTimeout(function(){
				tweetFromBot(tweetStr, data);
			}, 1000*3);

			// フォロー
			console.log("[INFO]Follow!");
			setTimeout(function(){
				createFriendshipWithBot(data);
			}, 1000*4);
		} else if (isRemove) {
			var tweetStr = printf('@%s さん、リムーブするよ。またフォローしてほしい時はそう言ってね。 %s'
				, data.user.screen_name
				, new Date()
				);

			// 5秒後にツイート
			console.log("[INFO]Tweet!");
			setTimeout(function(){
				tweetFromBot(tweetStr, data);
			}, 1000*3);

			// フォロー
			console.log("[INFO]Remove!");
			setTimeout(function(){
				destroyFriendshipWithBot(data);
			}, 1000*4);
		}
	
	});

	// Disconnect
	//setTimeout(stream.destroy, 1000 * 30);
});

function createFriendshipWithBot(data) {
	try {
		bot.createFriendship(data.user.id, {}, function(data) {
			console.log('[IN]createFriendshipWithBot');
			console.log(data);
			console.log('[OUT]createFriendshipWithBot');
		});
	} catch (ex) {
		console.warn('[CATCH]createFriendshipWithBot');
		console.warn(ex);
	}
}

function destroyFriendshipWithBot(data) {
	try {
		bot.destroyFriendship(data.user.id, function(data) {
			console.log('[IN]destroyFriendshipWithBot');
			console.log(data);
			console.log('[OUT]destroyFriendshipWithBot');
		});
	} catch (ex) {
		console.warn('[CATCH]destroyFriendshipWithBot');
		console.warn(ex);
	}
}

function tweetFromBot(tweetStr, data) {
	try {
		bot.updateStatus(tweetStr, function(data) {
			console.log('[IN]tweetFromBot');
			console.log("tweetStr = " + tweetStr);
			console.log(data);
			console.log('[OUT]tweetFromBot');
		});
	} catch (ex) {
		console.warn('[CATCH]tweetFromBot');
		console.warn(ex);
	}
}

function isFollowRequest(data, followPattern) {
	var regTest = false;
	var regExp = null;

	// 引数チェック
	if (!followPattern) {
		console.error('[ERROR] isFollowRequest: invalid argment. return false. followPattern => ' + followPattern);
		return false;
	}
	if ( !('text' in data) ) {
		console.error('[ERROR] isFollowRequest: invalid argment. return false. data => ' + data);
		return false;
	}

	// debug
	console.log("[DEBUG] isFollowRequest: data.text -> " + data.text);

	// リストに登録したフォローTweetのパターンを検証
	for (var index in followTweets) {
		try {
			// debug
			console.log("[DEBUG] isFollowRequest: followTweets[index] -> " + followTweets[index]);

			// 正規表現で評価
			regExp = new RegExp(followTweets[index]);
			regTest = regExp.test(data.text);

			// 一致ならtrueを返す
			if (regTest) {
				return true;
			}
		} catch (ex) {
			console.warn('[CATCH] isFollowRequest: catch exception.');
			console.warn(ex);
			continue;
		}
	}
	return false;
}
