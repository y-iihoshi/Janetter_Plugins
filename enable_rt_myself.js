//================================================
// enable_rt_myself.js
// Author: @iihoshi
//================================================

(function($, jn) {

	var my_filename = 'enable_rt_myself.js';

	// プラグイン情報 ここから
	// プラグイン情報の初期化
	if (!jn.pluginInfo)
		jn.pluginInfo = {};
	// プラグイン情報本体
	jn.pluginInfo[my_filename.split('.')[0]] = {
		'name' : {
			'ja' : '自分自身をリツイート',
			'en' : 'Enable RT Myself'
		},
		'author' : {
			'en' : '@iihoshi'
		},
		'version' : '1.0.0',
		'file' : my_filename,
		'language' : ['en', 'ja'],
		'last_update' : "2017/2/4",
		'update_timezone' : '9',
		'jnVersion' : '4.3.1.0',
		'description' : {
			'ja' : '自分のツイートをリツイートできるようにします。（但し非公開アカウントを除く）',
			'en' : 'Enables to retweet your own tweets; except for protected users.'
		},
		'updateinfo' : 'http://www.colorless-sight.jp/archives/JanetterPluginUpdateInfo.txt'
	};
	// プラグイン情報ここまで

	var onShowCommon = jn.contextMenu.onShowCommon;
	jn.contextMenu.onShowCommon = function(e, context) {
		onShowCommon.apply(this, arguments);
		$(this).children('li[action="retweet"]')
			.find('li').attr('action', 'retweet')
			.removeClass('disabled');
	};

})(jQuery, janet);
