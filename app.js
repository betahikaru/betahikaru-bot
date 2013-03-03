var util = require('util'),
	twitter = require('twitter');

var bot = new twitter({
	consumer_key		: '',
	consumer_secret		: '',
	access_token_key	: '',
	access_token_secret	: ''
});

/*
bot.updateStatus('Hello, world!', function (data) {
	console.log(data);
});
*/

/*
bot.stream('user', function(stream) {
	stream.on('data', function(data) {
		console.log(data);
	});
});
*/
/*
bot.stream('user', {track: 'betahikaru'}, function(stream) {
	stream.on('data', function(data) {
		console.log(util.inspect(data));
	});

	// Disconnect
	setTimeout(stream.destroy, 5000);
});
*/

/*
bot.stream('statuses/sample', function(stream) {
	stream.on('data', function(data) {
		console.log(util.inspect(data));
	});
});
*/

/**
 * オウム返しボット
 */
var BOT_ID = 'betahikaru_dev'; // twitter account
/*
bot.stream('user', function(stream) {
	stream.on('data', function(data) {
		// ツイートにはtextがある。ツイート以外の場合は終了
		if (!('text' in data)) {
			console.error('[ERROR] invalid data');
			return;
		}

		// ツイートした人、内容、リプライか否かを取得
		var twUserId = data.user.screen_name
		, replyStr = data.text.replace(new RegExp('^@' + BOT_ID + ' '), '')
		, isMention = (data.in_reply_to_user_id !== null)
		;

		// 自分のツイート、または、リプライ以外の場合は終了
		if (!isMention || twUserId === BOT_ID) {
			return;
		}

		// tweet
		bot.updateStatus('@' + twUserId + ' ' + replyStr, function(data) {
			console.log(data);
		});
	});

	// Disconnect
	//setTimeout(stream.destroy, 1000 * 30);
});
*/

// 検索条件　
var condition = {
	track: 'bot'
};
bot.stream('user', condition, function(stream) {
	stream.on('data', function(data) {
		// ツイートにはtextがある。ツイート以外の場合は終了
		if (!('text' in data)) {
			console.error('[ERROR] invalid data');
			return;
		}

		// ツイートした人、内容、リプライか否かを取得
		var twUserId = data.user.screen_name
		;

		// 自分のツイートの場合は終了
		if (twUserId === BOT_ID) {
			return;
		}

		// tweet
		var twStr = twUserId + ' さんが、"'
					+ data.text + '"ってつぶやいた';
		bot.updateStatus(twStr, function(data) {
			console.log(data);
		});
	});

	// Disconnect
	//setTimeout(stream.destroy, 1000 * 30);
});
