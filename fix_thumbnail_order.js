//================================================
// fix_thumbnail_order.js
// Author: @iihoshi
//================================================

(function ($, jn) {

	var my_filename = 'fix_thumbnail_order.js';

	// プラグイン情報 ここから
	// プラグイン情報の初期化
	if(!jn.pluginInfo)
		jn.pluginInfo = {};
	// プラグイン情報本体
	jn.pluginInfo[my_filename.split('.')[0]] = {
		'name' : {
			'ja' : '複数サムネイル表示順固定',
			'en' : 'Fix the order of thumbnails'
		},
		'author' : {
			'en' : '@iihoshi'
		},
		'version' : '1.0.0',
		'file' : my_filename,
		'language' : ['en', 'ja'],
		'last_update' : "2015/4/23",
		'update_timezone' : '9',
		'jnVersion' : '4.3.0.2',
		'description' : {
			'ja' : 'ツイート一つにサムネイル画像が複数ある場合、その表示順を正しい順で固定します。',
			'en' : 'Fix a display order of thumbnails in each tweet.'
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

		var mod = orig_janetterThumbnail
			.replace(/^(\s*)(var new_image = new Image\(\);)$/m,
			         "$1_tweetThumb.append($$('<span/>').text(thumb_url).css({ display: 'none' }));  // inserted by " + my_filename + "\n$1$2")
			.replace(/^(\s*)_tweetThumb\.append\($/m,
			         "$1_tweetThumb.children('span:contains(\"' + thumb_url + '\")').replaceWith(  // replaced by " + my_filename)
			.replace(/^(\s*)\)\.(addClass\('disp'\));$/m,
			         "$1);  _tweetThumb.$2;  // replaced by " + my_filename)
		//console.log(mod);
		eval('$.fn.janetterThumbnail = ' + mod);

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
