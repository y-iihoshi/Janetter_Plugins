//================================================
// show_reply_thumbnails.js
// Author: @iihoshi
//================================================

(function ($, jn) {

	var my_filename = 'show_reply_thumbnails.js';

	// プラグイン情報 ここから
	// プラグイン情報の初期化
	if(!jn.pluginInfo)
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
		'version' : '1.0.0',
		'file' : my_filename,
		'language' : ['en', 'ja'],
		'last_update' : "2015/9/23",
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

	// 本プラグインの初期化処理（onInitializeDone 時）
	function initOnInitialized() {
		var orig_janetterThumbnail = $.fn.janetterThumbnail.toString();
		var re_tweetThumb = /^(\s*_tweetThumb) = _content.siblings\('div\.tweet-thumb'\);$/m;
		var re_content_find = /^(.*)_content\.find\('div\.tweet-body/gm;

		if (re_tweetThumb.test(orig_janetterThumbnail) &&
			re_content_find.test(orig_janetterThumbnail)){
			var replaced = orig_janetterThumbnail
				.replace(re_tweetThumb, "$1 = _content.children('div.tweet-thumb')")
				.replace(re_content_find, "$1_content.find('div.tweet-reply-body");
			// console.log(replaced);
			eval('$.fn.janetterThumbnailForReply = ' + replaced);
		} else {
			new jn.msgdialog({
				title: my_filename,
				icon: '',
				message: 'Sorry, ' + my_filename+ ' cannot be installed.',
				buttons: [ janet.msg.ok ],
			});
			return;
		}

		var tnMouseOverHandler = function () {
			var $this = $(this),
				tweet_reply = $this.parents('div.tweet-reply:first');
			$this.unbind('mouseover', tnMouseOverHandler);
			if (tweet_reply.length > 0) {
				tweet_reply.janetterThumbnailForReply($this.attr('href'));
			}
		};

		$.fn.janetterThumbnailForReplyEventSet = function() {
			this.bind('mouseover', tnMouseOverHandler);
			return this;
		};

		var expandUrl = function (a) {
			jn.expandurl({
				url: a.attr('expanded') || a.attr('href'),
				done: function (success, url) {
					if (success)
						a.attr('expanded', url).attr('title', url.decodeURI());
					var tweet_content = a.parents('div.tweet-content:first');
					if ((tweet_content.length > 0) &&
						!a.prop('thumnailed') &&
						tweet_content.janetterThumbnail)
						tweet_content.janetterThumbnail(url.htmlEncode(true), true);

					var tweet_reply = a.parents('div.tweet-reply:first');
					if ((tweet_reply.length > 0) &&
						!a.prop('thumnailed') &&
						tweet_reply.janetterThumbnailForReply)
						tweet_reply.janetterThumbnailForReply(url.htmlEncode(true), true);

					a.trigger('mouseover');
				}
			});
		}

		var euMouseOverHandler = function(){
			var $this = $(this);
			$this.unbind('mouseover', euMouseOverHandler);
			expandUrl($this);
		}

		$.fn.janetterExpandUrlEventSet = function(){
			this.bind('mouseover', euMouseOverHandler);
			return this;
		}

		var orig_generateReply = jn.generateReply;
		jn.generateReply = function(item, is_default) {
			var reply = orig_generateReply(item, is_default);
			reply.append('<div class="tweet-thumb"/>');

			var a = reply.find('.tweet-reply-body > p.text').replaceReadline().children('a.link');
			a.janetterExpandUrlEventSet();
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
		jn.onInitializeDone = function() {
			orig_onInitializeDone && orig_onInitializeDone.apply(this, arguments);
			initOnInitialized();
		};
	}

})(jQuery, janet);
