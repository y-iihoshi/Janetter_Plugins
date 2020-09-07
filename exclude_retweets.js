//================================================
// exclude_retweets.js
// Author: @iihoshi
//================================================

(function ($, jn) {

	if ((_Janetter_Window_Type != "main") && (_Janetter_Window_Type != "profile"))
		return;

	var my_filename = 'exclude_retweets.js';

	// プラグイン情報 ここから
	// プラグイン情報の初期化
	if (!jn.pluginInfo)
		jn.pluginInfo = {};
	// プラグイン情報本体
	jn.pluginInfo[my_filename.split('.')[0]] = {
		'name' : {
			'ja' : 'RT 除外検索',
			'en' : 'Search excluding retweets'
		},
		'author' : {
			'en' : '@iihoshi'
		},
		'version' : '1.0.0',
		'file' : my_filename,
		'language' : ['en', 'ja'],
		'last_update' : "2020/9/7",
		'update_timezone' : '9',
		'jnVersion' : '4.5.1.0',
		'description' : {
			'ja' : 'Twitter 検索結果からリツイートを除外します。',
			'en' : 'Excludes retweets from Twitter search result.'
		},
		'updateinfo' : 'https://www.colorless-sight.jp/archives/JanetterPluginUpdateInfo.txt'
	};
	// プラグイン情報ここまで

	var original_addSearchTimeline = jn.addSearchTimeline;
	jn.addSearchTimeline = function(q) {
		if (!q)
			return;
		if (!q.includes('-filter:nativeretweets') &&
			!q.includes('exclude:nativeretweets'))
			q += ' -filter:nativeretweets';
		original_addSearchTimeline.call(this, q);
	};

})(jQuery, janet);
