//================================================
// show_shortened_url.js
// Author: @iihoshi
//================================================

(function($, jn) {

	// プラグイン情報 ここから
	// プラグイン情報の初期化
	if(!jn.pluginInfo)
		jn.pluginInfo = {};
	// プラグイン情報本体
	jn.pluginInfo['show_shortened_url'] = {
		'name' : {
			'ja' : '短縮 URL 表示',
			'en' : 'Show shortened URL'
		},
		'author' : {
			'en' : '@iihoshi'
		},
		'version' : '1.0.0',
		'file' : 'show_shortened_url.js',
		'language' : ['en', 'ja'],
		'last_update' : "2014/3/2",
		'update_timezone' : '9',
		'jnVersion' : '4.2.3.0',
		'description' : {
			'ja' : 'リンクにマウスカーソルを載せた時に短縮 URL も一緒に表示します。',
			'en' : 'Shows a shortened URL when a mouse cursor is over a linked string.'
		},
		'updateinfo' : 'http://www.colorless-sight.jp/archives/JanetterPluginUpdateInfo.txt'
	};
	// プラグイン情報ここまで

	// 本プラグインの初期化処理（onInitializeDone 時）
	function initOnInitialized() {
		var orig_expandUrl = jn.expandUrl.toString();
		var source = "a.attr('expanded', url).attr('title', url.decodeURI());";
		var target = "a.attr('expanded', url); a.attr('title', url.decodeURI() + '\\n' + a.attr('href').decodeURI());  // replaced by show_shortened_url.js";

		// Thanks to @rilponi and @hmhk_016.
		if (orig_expandUrl.indexOf(source) >= 0) {
			eval('jn.expandUrl = ' + orig_expandUrl.replace(source, target));
		} else {
			new jn.msgdialog({
				title: 'show_shortened_url.js',
				icon: '',
				message: 'show_shortened_url.js can not be installed. Please uninstall me.',
				buttons: [janet.msg.ok]
			});
		}

		console.log('show_shortened_url.js has been initialized.');
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
