//================================================
// show_reply_thumbnails.js
// Author: @iihoshi
//================================================

(function ($, jn) {

	var my_filename = 'show_reply_thumbnails.js';

	// プラグイン情報 ここから
	// プラグイン情報の初期化
	if (!jn.pluginInfo)
		jn.pluginInfo = {};
	// プラグイン情報本体
	jn.pluginInfo[my_filename.split('.')[0]] = {
		'name' : {
			'ja' : 'リプライサムネイル表示',
			'en' : 'Show thumbnails in reply chain'
		},
		'author' : {
			'en' : '@iihoshi'
		},
		'version' : '1.0.1',
		'file' : my_filename,
		'language' : ['en', 'ja'],
		'last_update' : "2015/9/24",
		'update_timezone' : '9',
		'jnVersion' : '4.3.1.0',
		'description' : {
			'ja' : 'リプライにサムネイル画像があれば表示します。',
			'en' : 'Shows thumbnails if a tweet in a reply chain has them.'
		},
		'updateinfo' : 'http://www.colorless-sight.jp/archives/JanetterPluginUpdateInfo.txt'
	};
	// プラグイン情報ここまで

	if ((_Janetter_Window_Type != "main") && (_Janetter_Window_Type != "profile")) {
		return;
	}

	function initForThumbnail() {
		var orig_janetterThumbnail = $.fn.janetterThumbnail.toString();
		var re_siblings = /_content\.siblings\('div\.tweet-thumb'\);$/m;
		var re_find = /_content\.find\('div\.tweet-body /gm;

		if (!re_siblings.test(orig_janetterThumbnail) ||
			!re_find.test(orig_janetterThumbnail)) {
			return false;
		}

		var replaced = orig_janetterThumbnail
			.replace(re_siblings, "_content.children('div.tweet-thumb');")
			.replace(re_find, "_content.find('div.tweet-reply-body ");
		// console.log(replaced);
		eval('$.fn.janetterThumbnailForReply = ' + replaced);

		var tnMouseOverHandler = function () {
			var $this = $(this),
				tweet_reply = $this.parents('div.tweet-reply:first');
			$this.unbind('mouseover', tnMouseOverHandler);
			if (tweet_reply.length > 0) {
				tweet_reply.janetterThumbnailForReply($this.attr('href'));
			}
		};

		$.fn.janetterThumbnailForReplyEventSet = function () {
			this.bind('mouseover', tnMouseOverHandler);
			return this;
		};

		return true;
	}

	function initForExpandUrl() {
		var orig_jn_expandUrl = jn.expandUrl.toString();
		var re_tweet_content = /div\.tweet-content:first/m;
		var re_janetterThumbnail = /\.janetterThumbnail(\W)/gm;

		if (!re_tweet_content.test(orig_jn_expandUrl) ||
			!re_janetterThumbnail.test(orig_jn_expandUrl)) {
			return false;
		}

		var replaced = orig_jn_expandUrl
			.replace(re_tweet_content, 'div.tweet-reply:first')
			.replace(re_janetterThumbnail, '.janetterThumbnailForReply$1');
		// console.log(replaced);
		eval('var expandUrl = ' + replaced);

		var euMouseOverHandler = function () {
			var $this = $(this);
			$this.unbind('mouseover', euMouseOverHandler);
			expandUrl($this);
		}

		$.fn.janetterExpandUrlForReplyEventSet = function () {
			this.bind('mouseover', euMouseOverHandler);
			return this;
		}

		return true;
	}

	// 本プラグインの初期化処理（onInitializeDone 時）
	function initOnInitialized() {
		if (!initForThumbnail() || !initForExpandUrl()) {
			new jn.msgdialog({
				title: my_filename,
				icon: '',
				message: 'Sorry, ' + my_filename+ ' cannot be installed.',
				buttons: [ janet.msg.ok ],
			});
			return;
		}

		var orig_generateReply = jn.generateReply;
		jn.generateReply = function (item, is_default) {
			var reply = orig_generateReply(item, is_default);
			reply.append('<div class="tweet-thumb"/>');

			var a = reply.find('.tweet-reply-body > p.text').children('a.link');
			a.janetterExpandUrlForReplyEventSet();
			if (jn.conf.disp_thumbnail == 'over')
				a.janetterThumbnailForReplyEventSet();
			else
				reply.janetterThumbnailForReply(a);

			return reply;
		};

		console.log(my_filename + ' has been initialized.');
	}

	if (jn.temp.initialized) {
		// The original onInitializeDone() has already been called!
		initOnInitialized();
	} else {
		var orig_onInitializeDone = jn.onInitializeDone;
		jn.onInitializeDone = function () {
			orig_onInitializeDone && orig_onInitializeDone.apply(this, arguments);
			initOnInitialized();
		};
	}

})(jQuery, janet);
