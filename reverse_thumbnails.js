//================================================
// reverse_thumbnails.js
// Author: @iihoshi
//================================================

(function ($, jn) {

	var my_filename = 'reverse_thumbnails.js';

	// プラグイン情報 ここから
	// プラグイン情報の初期化
	if(!jn.pluginInfo)
		jn.pluginInfo = {};
	// プラグイン情報本体
	jn.pluginInfo[my_filename.split('.')[0]] = {
		'name' : {
			'ja' : '複数サムネイル表示順反転',
			'en' : 'Reverse the order of thumbnails'
		},
		'author' : {
			'en' : '@iihoshi'
		},
		'version' : '1.0.0',
		'file' : my_filename,
		'language' : ['en', 'ja'],
		'last_update' : "2014/9/21",
		'update_timezone' : '9',
		'jnVersion' : '4.2.3.0',
		'description' : {
			'ja' : 'ツイート一つにサムネイル画像が複数ある場合、その表示順を反転します。',
			'en' : 'Reverses a display order of thumbnails in each tweet.'
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
		var source = /permalink_list.unshift(.+)/g;
		var target = "permalink_list.push$1  // replaced by " + my_filename;

		eval('$.fn.janetterThumbnail = ' + orig_janetterThumbnail.replace(source, target));

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
