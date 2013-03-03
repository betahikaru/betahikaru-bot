var util = require('util')
,	twitter = require('twitter')
,	printf = require('printf')
	;

var bot = new twitter({
	consumer_key		: '',
	consumer_secret		: '',
	access_token_key	: '',
	access_token_secret	: ''
});

var BOT_ID = 'betahikaru_dev'; // twitter account

var replyMap = {
	'こんにち(は|わ)'		: 'Hello world！'
	,'おやすみ(なさい)?'	: 'おやすみー'
	,'(.*?)なう'			: '%sしてるのかーそうかー'
	,'(いつ.*生ま|誕生日|(なん|何)(歳|才|さい|ちゃい)).*？'	: '平成24年の3月2日うまれ！０歳だよ！'
	,'(.*'				: 'test'
	,'阿！'				: '吽！' 
};

// キャッチされない例外があった場合の救済措置
process.on('uncaughtException', function(err) {
	console.error('uncaughtException => ' + err);
});

// botのタイムラインを監視
bot.stream('user', function(stream) {
	stream.on('data', function(data) {
		// ツイートにはtextがある。ツイート以外の場合は終了
		if (!('text' in data)) {
			console.error('[ERROR] invalid data');
			return;
		}

		// 自分のツイートの場合は終了
		if (data.user.screen_name === BOT_ID) { return; }

		// マップに登録した全パターンを検証
		for (var regex in replyMap) {
			// 正規表現のパターンと一致したらツイートして処理終了
			var testReg = false;
			try {
				testReg = new RegExp(regex).test(data.text);
			} catch (ex) {
				console.error(ex);
				continue;
			}

			if ( new RegExp(regex).test(data.text) ) {
				var replyStr = printf(replyMap[regex], RegExp.$1);
				var tweetStr = printf('@%s %s', data.user.screen_name, replyStr);

				// 5秒後にツイート
				setTimeout(function(){
					tweetFromBot(tweetStr, data);
				}, 1000*5);
				return;
			}
		}
	});

	// Disconnect
	//setTimeout(stream.destroy, 1000 * 30);
});

function tweetFromBot(tweetStr, data) {
	try {
		bot.updateStatus(tweetStr, function(data) {
			console.log(data);
		});
	} catch (ex) {
		console.error(ex);
	}
}
