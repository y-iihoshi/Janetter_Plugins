//================================================
// apply_twemoji.js
// Author: @iihoshi
//================================================

(function ($, jn) {

	if ((_Janetter_Window_Type != "main") && (_Janetter_Window_Type != "profile"))
		return;

	var my_filename = 'apply_twemoji.js';

	// プラグイン情報 ここから
	// プラグイン情報の初期化
	if (!jn.pluginInfo)
		jn.pluginInfo = {};
	// プラグイン情報本体
	jn.pluginInfo[my_filename.split('.')[0]] = {
		'name' : {
			'ja' : 'Twitter 絵文字表示',
			'en' : 'Show Twitter Emoji'
		},
		'author' : {
			'en' : '@iihoshi'
		},
		'version' : '1.5.0',
		'file' : my_filename,
		'language' : ['en', 'ja'],
		'last_update' : "2022/12/28",
		'update_timezone' : '9',
		'jnVersion' : '4.5.1.0',
		'description' : {
			'ja' : 'twemoji を利用して絵文字を画像で表示します。',
			'en' : 'Shows emojis as images by using twemoji.'
		},
		'updateinfo' : 'https://www.colorless-sight.jp/archives/JanetterPluginUpdateInfo.txt'
	};
	// プラグイン情報ここまで

	// See: http://api.jquery.com/jQuery.getScript/#entry-examples
	$.cachedScript = function(url, options) {
		options = $.extend( options || {}, {
			dataType: 'script',
			cache: true,
			url: url
		});
		return $.ajax(options);
	};

	$.fn.extend({
		applyTwemoji: function() {
			this.each(function() {
				twemoji.parse(this, {
					base: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/'
				});
			}).find('img.emoji').css({
				float: 'none',
				height: '1em',
				width: '1em',
				margin: '0 .1em',
				verticalAlign: 'baseline'
			});
			return this;
		}
	});

	function setup() {
		if (_Janetter_Window_Type == "main") {
			jn.get$Timelines().applyTwemoji();
		} else if (_Janetter_Window_Type == "profile") {
			$('#user-info > .username').applyTwemoji();
			$('#content > .tab01 > .prof-content').applyTwemoji();
		}

		var generate = jn.tweetController.prototype.generate;
		jn.tweetController.prototype.generate = function(conversation) {
			return generate.apply(this, arguments).applyTwemoji();
		};

		var generateReply = jn.generateReply;
		jn.generateReply = function(item, is_default) {
			return generateReply.apply(this, arguments).applyTwemoji();
		};
	}

	$.cachedScript("https://cdn.jsdelivr.net/npm/twemoji@latest/dist/twemoji.min.js")
		.done(function(script, textStatus, jqxhr) {
			console.log(my_filename + ": " + textStatus);
			setup();
		})
		.fail(function(jqxhr, textStatus, errorThrown) {
			console.log(my_filename + ": " + errorThrown);
		});

})(jQuery, janet);
