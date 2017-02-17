//================================================
// expand_truncated_url.js
// Author: @iihoshi
//================================================

(function($, jn) {

	var my_filename = 'expand_truncated_url.js';

	if (_Janetter_Window_Type != "main" && _Janetter_Window_Type != "profile")
		return;

	// プラグイン情報 ここから
	// プラグイン情報の初期化
	if (!jn.pluginInfo)
		jn.pluginInfo = {};
	// プラグイン情報本体
	jn.pluginInfo[my_filename.split('.')[0]] = {
		name: {
			ja: '省略 URL 展開',
			en: 'Expand Truncated URL'
		},
		author: {
			ja: '@iihoshi',
			en: '@iihoshi'
		},
		version: '1.0.1',
		file: my_filename,
		language: ['en', 'ja'],
		last_update: "2017/2/17",
		update_timezone: '9',
		jnVersion: '4.3.1.0',
		description: {
			ja: '末尾が省略された URL 文字列を展開して表示します。',
			en: 'Expands URL strings truncated by ellipsises.'
		},
		updateinfo: 'http://www.colorless-sight.jp/archives/JanetterPluginUpdateInfo.txt'
	};
	// プラグイン情報ここまで

	String.prototype.truncated = function() {
		// Ends with a horizontal ellipsis?
		return /\u2026$/.test(this);
	};

	$.fn.extend({
		expandTruncatedUrl: function() {
			return this.each(function() {
				var $this = $(this);
				var expanded = $this.attr('expanded');
				if (expanded && $this.text().truncated())
					$this.text(expanded.decodeURI());
			});
		}
	});

	var generate = jn.tweetController.prototype.generate;
	jn.tweetController.prototype.generate = function(conversation) {
		var container = generate.apply(this, arguments);

		container.find('div.tweet-content > .tweet-body > p.text')
			.children('a.link').expandTruncatedUrl();

		return container;
	};

	var generateReply = jn.generateReply;
	jn.generateReply = function(item, is_default) {
		var reply = generateReply.apply(this, arguments);

		reply.find('.tweet-reply-body > p.text')
			.children('a.link').expandTruncatedUrl();

		return reply;
	};

})(jQuery, janet);
