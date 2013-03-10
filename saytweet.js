var util = require('util')
,	twitter = require('twitter')
,	printf = require('printf')
,	fs = require('fs')
,	exec = require('child_process').exec
	;

var keyandsecrets;
try {
	keyandsecrets = JSON.parse(fs.readFileSync(__dirname + '/twitterAccountBetahikaru.json'));
} catch (ex) {
	console.error(ex);
	throw ex;
}

var bot = new twitter(keyandsecrets);

var BOT_SCREEN_NAME = 'betahikaru';

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
			console.log('[WARN] invalid data');
			console.log('data:\r\n' + data);
			return;
		}

		// 自分のツイートの場合は終了
		if (data.user.screen_name === BOT_SCREEN_NAME) { return; }

		console.log(data);

		// ツイート内容をSAY
		console.log("[INFO]ツイート内容をSAY!");
		sayTweet(data.text);
	
	});

	// Disconnect
	//setTimeout(stream.destroy, 1000 * 30);
});

function sayTweet(text) {
	var saykana = exec('echo ' + text + ' | mecab -O yomi >&1 | saykana', function(err, stdout, stderr) {
		if (!err) {
			console.log('stdout: \r\n' + stdout);
		} else {
			console.log(err);
		}
	});
}
