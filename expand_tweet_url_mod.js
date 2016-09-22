//================================================
// expand_tweet_url_mod.js
// Author: @iihoshi
//
// This script is a derivative work of:
// ツイートURLを展開
// Author: @hina_016
//================================================

(function($, jn) {

	if(_Janetter_Window_Type != "main" && _Janetter_Window_Type != "profile") return;

	// プラグイン情報 ここから
	// プラグイン情報の初期化
	if(!jn.pluginInfo)
		jn.pluginInfo = {};
	// プラグイン情報本体
	jn.pluginInfo['expand_tweet_url_mod'] = {
		'name' : {
			'ja' : 'ツイートURLを展開',
			'en' : 'Expand Tweet URL'
		},
		'author' : {
			'ja' : '@iihoshi',
			'en' : '@iihoshi'
		},
		'version' : '160922',
		'file' : 'expand_tweet_url_mod.js',
		'language' : ['en', 'ja'],
		'last_update' : "2016/9/22",
		'update_timezone' : '9',
		'jnVersion' : '4.3.1.0',
		'description' : {
			'ja' : 'ツイートURLを展開して表示します。',
			'en' : 'Expands tweet URLs and displays the contents.'
		},
		'updateinfo' : 'http://www.colorless-sight.jp/archives/JanetterPluginUpdateInfo.txt'
	};
	// プラグイン情報ここまで

	var init = jn.onInitializeDone;
	jn.onInitializeDone = function() {
		init && init();
		main();
	}

	var tweet_cache = {}; // id -> data
	var tweet_re = /twitter.com\/.+\/status(es)?\/(\d+)(\/|\?.*)?$/;

	function main() {
		// ツイートのURLをマウスオーバーした時
		var target = _Janetter_Window_Type == "main" ? $("#timeline-view") : $("#prof-main");
		target.on("mouseover", ".link", function(event) {
			var elm = $(this);
			var url = elm.attr("expanded");

			var id = url2id(url);
			if(!id) return;

			show_quote(elm, id);
		});
	}

	function show_quote(elm, id) {
		// box作成
		var tweet = elm.closest(".tweet-reply");
		if(tweet.length) {
			var url_quote_box = tweet.next(".url-quote-box");

			if(!url_quote_box.length)
				url_quote_box = $("<div class='url-quote-box'>").insertAfter(tweet);
		} else {
			tweet = elm.closest(".tweet-body")
			var tweet_box = elm.closest(".tweet-box");
			var url_quote_box = tweet_box.children(".url-quote-box");
			if(!url_quote_box.length)
				url_quote_box = $("<div class='url-quote-box'>").insertBefore(tweet_box.children(".tweet-reply-box"));
		}

		// 展開済みならやめる
		if(url_quote_box.data("etu_list" + id)) return;

		url_quote_box.data("etu_list" + id, true);

		var juid = _Janetter_Window_Type == "main"
			? elm.closest(".timeline-container").attr("juid")
			: jn.profileDialog.account.juid;

		// boxに追加
		$.when(get_tweet(id, juid)).done(function(data) {
			add_quote(url_quote_box, generate_quote(data, $(elm).attr("expanded"), id), tweet);
		}).fail(function() {
			jn.notice("ツイート展開に失敗しました。ID: " + id, 3000);
		});
	}

	function get_tweet(id, juid) {
		var dfd = $.Deferred();

		return tweet_cache[id] || (function() {
			if(_Janetter_Window_Type == "main")
				jn.notice("ツイート展開中… ID: " + id, 3000);

			jn.websocket.send({
				action: 'direct',
				data: {
					juid: juid,
					method: 'GET',
					path: '/statuses/show',
					id: id,
					include_entities: true,
					api11: true,
					tweet_mode: 'extended'
				},
				done: function(success, data, code) {
					success ? dfd.resolve(data) : dfd.reject();
				}
			});
			return dfd.promise();
		})();
	}

	function generate_quote(data, url, id) {
		// dataのクローン作成
		var data2 = JSON.parse(JSON.stringify(data));

		if(data2.full_text) {
			data2.text = data2.full_text;
			delete data2.full_text;
		}

		// replyのテンプレを使う
		return jn.generateReply(data2).prepend("<span>Tweet ID: <a href='%1'>%2</a></span>".format(url, id)).data("etu_id", id);
	}

	function add_quote(box, quote, tweet) {
			var ch = box.children();
			var link = tweet.find(".link");

			if(ch.length) {
				var target_idx = 0;
				link.each(function() {
					var id = url2id($(this).attr("expanded"));
					if(!id) return;

					if(id == quote.data("etu_id")) {
						ch.eq(target_idx).before(quote);
						return false;
					} else if(id == ch.eq(target_idx).data("etu_id")) {
						target_idx++;
						if(ch.length <= target_idx) {
							box.append(quote);
							return false;
						}
					}
				});
			} else
				box.append(quote);
	}

	function url2id(url) {
		if(!url) return;

		var match = url.match(tweet_re);
		if(!match) return;

		return match[2];
	}

})(jQuery, janet);
