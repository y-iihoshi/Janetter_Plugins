//================================================
// イベント発生タイミング確認用プラグイン
// Author: @iihoshi
// Special Thanks: Janetter wiki users
//================================================
(function ($, jn) {

	// console.log('eventcheck.js: Start.');

	// プラグイン情報 ここから
	// プラグイン情報の初期化
	if (!jn.pluginInfo)
		jn.pluginInfo = {};
	// プラグイン情報本体
	jn.pluginInfo['eventcheck'] = {
		'name' : {
			'ja' : 'イベント発生タイミング確認',
			'en' : 'Check event occurring timings'
		},
		'author' : {
			'en' : '@iihoshi'
		},
		"version" : "1.1.0",
		'file' : 'eventcheck.js',
		'language' : ['de','en','es','ja','ko','pt','zh-CN'],
		"last_update" : "2012/12/06",
		'update_timezone' : '9',
		'jnVersion' : '4.0.1.0 -',
		'description' : {
			'en' : 'http://www44.atwiki.jp/janetterref/pages/49.html'
		},
		'updateinfo' : 'http://www.colorless-sight.jp/archives/JanetterPluginUpdateInfo.txt'
	};
	// プラグイン情報ここまで

//	if (jn.temp.pluginLoaded)
//		console.log('eventcheck.js: janet.pluginLoad() has already been called!');
	if (jn.temp.initialized)
		console.log('eventcheck.js: janet.onInitializeDone() has already been called!');

	/* プラグインが利用するものではないため、コメントアウト
		http://jbbs.livedoor.jp/bbs/read.cgi/internet/8173/1340690924/853
	// 初期化処理の開始時
	// janet.onInitialize();
	var origin_onInitialize = jn.onInitialize;
	jn.onInitialize = function () {
		origin_onInitialize && origin_onInitialize();
		console.log('初期化処理の開始時 janet.onInitialize();');
	};
	*/

	// 初期化処理の終了時
	// janet.onInitializeDone();
	var origin_onInitializeDone = jn.onInitializeDone;
	jn.onInitializeDone = function () {
		origin_onInitializeDone && origin_onInitializeDone();
		console.log('初期化処理の終了時 janet.onInitializeDone();');

		// フォントサイズ変更時 (timelineController)
		// janet.timelineController.onChangeFontSize();
		if (_Janetter_Window_Type == 'main') {
			jn.get$Timelines().each(function(){
				// 初期化処理終了後に追加されたTLにはいつ登録すれば良いんだ??
				var origin_tlctl_onChangeFontSize = this.controller.onChangeFontSize;
				this.controller.onChangeFontSize = function () {
					origin_tlctl_onChangeFontSize && origin_tlctl_onChangeFontSize();
					console.log('フォントサイズ変更時 janet.timelineController.onChangeFontSize();');
				};
			});
		}
	};

	// 設定を取得した時
	// janet.onGetConfig(success, data);
	var origin_onGetConfig = jn.onGetConfig;
	jn.onGetConfig = function (success, data) {
		origin_onGetConfig && origin_onGetConfig(success, data);
		console.log('設定を取得した時 janet.onGetConfig(success, data);');
	};

	// 設定を変更した時
	// janet.onSetConfig(success, data);
	var origin_onSetConfig = jn.onSetConfig;
	jn.onSetConfig = function (success, data) {
		origin_onSetConfig && origin_onSetConfig(success, data);
		console.log('設定を変更した時 janet.onSetConfig(success, data);');
	};

	// 翻訳情報を取得した時(前処理)
	// janet.onGetMessages(success, data);
	var origin_onGetMessages = jn.onGetMessages;
	jn.onGetMessages = function (success, data) {
		origin_onGetMessages && origin_onGetMessages(success, data);
		console.log('翻訳情報を取得した時(前処理) janet.onGetMessages(success, data);');
	};

	// 翻訳情報を取得した時(後処理)
	// janet.onGetMessagesDone(success, data);
	var origin_onGetMessagesDone = jn.onGetMessagesDone;
	jn.onGetMessagesDone = function (success, data) {
		origin_onGetMessagesDone && origin_onGetMessagesDone(success, data);
		console.log('翻訳情報を取得した時(後処理) janet.onGetMessagesDone(success, data);');
	};

	// アカウント情報を取得した時
	// janet.onGetAccounts(success, data);
	var origin_onGetAccounts = jn.onGetAccounts;
	jn.onGetAccounts = function (success, data) {
		origin_onGetAccounts && origin_onGetAccounts(success, data);
		console.log('アカウント情報を取得した時 janet.onGetAccounts(success, data);');
	};

	// タイムライン一覧を取得した時（起動直後）
	// janet.onLoadTimelines(success, data);
	var origin_onLoadTimelines = jn.onLoadTimelines;
	jn.onLoadTimelines = function (success, data) {
		origin_onLoadTimelines && origin_onLoadTimelines(success, data);
		console.log('タイムライン一覧を取得した時（起動直後） janet.onLoadTimelines(success, data);');
	};

	// タイムライン一覧を取得した時
	// janet.onGetTimelines(success, data);
	var origin_onGetTimelines = jn.onGetTimelines;
	jn.onGetTimelines = function (success, data) {
		origin_onGetTimelines && origin_onGetTimelines(success, data);
		console.log('タイムライン一覧を取得した時 janet.onGetTimelines(success, data);');
	};

	// リスト一覧を取得した時
	// janet.onGetLists(success, data);
	var origin_onGetLists = jn.onGetLists;
	jn.onGetLists = function (success, data) {
		origin_onGetLists && origin_onGetLists(success, data);
		console.log('リスト一覧を取得した時 janet.onGetLists(success, data);');
	};

	// ツイート欄を開こうとした時（return false; でキャンセル）
	// janet.onTweetBoxShowBegin(expanded);
	var origin_onTweetBoxShowBegin = jn.onTweetBoxShowBegin;
	jn.onTweetBoxShowBegin = function (expanded) {
		var stop = true;
		if (origin_onTweetBoxShowBegin)
			stop = origin_onTweetBoxShowBegin(expanded);
		console.log('ツイート欄を開こうとした時 janet.onTweetBoxShowBegin(expanded);');
		return stop;
	};

	// ツイート欄を開いた時
	// janet.onTweetBoxShowEnd(expanded);
	var origin_onTweetBoxShowEnd = jn.onTweetBoxShowEnd;
	jn.onTweetBoxShowEnd = function (expanded) {
		origin_onTweetBoxShowEnd && origin_onTweetBoxShowEnd(expanded);
		console.log('ツイート欄を開いた時 janet.onTweetBoxShowEnd(expanded);');
	};

	// ツイート欄を閉じた時
	// janet.onCompactTweetBox();
	var origin_onCompactTweetBox = jn.onCompactTweetBox;
	jn.onCompactTweetBox = function () {
		origin_onCompactTweetBox && origin_onCompactTweetBox();
		console.log('ツイート欄を閉じた時 janet.onCompactTweetBox();');
	};

	// ツイート送信後
	// janet.onTweeted(successSendTweet);
	var origin_onTweeted = jn.onTweeted;
	jn.onTweeted = function (successSendTweet) {
		origin_onTweeted && origin_onTweeted(successSendTweet);
		jn.notice(successSendTweet); // 通知バーの処理は自前でする必要があるが、かぶったらどうなるんだろうね？
		console.log('ツイート送信後 janet.onTweeted(successSendTweet);');
	};
	// DM送信後
	// janet.onMessaged(successSendMessage);
	var origin_onMessaged = jn.onMessaged;
	jn.onMessaged = function (successSendMessage) {
		origin_onMessaged && origin_onMessaged(successSendMessage);
		jn.notice(successSendMessage); // 通知バーの処理は自前でする必要がある、かぶったらどうなるんだろうね？
		console.log('DM送信後 janet.onMessaged(successSendMessage);');
	};

	// RT送信後
	// janet.onRetweeted(successSendRetweet);
	var origin_onRetweeted = jn.onRetweeted;
	jn.onRetweeted = function (successSendRetweet) {
		origin_onRetweeted && origin_onRetweeted(successSendRetweet);
		console.log('RT送信後 janet.onRetweeted(successSendRetweet);');
	};

	// テーマ用？
	// janet.onLoadEnd();
	var origin_onLoadEnd = jn.onLoadEnd;
	jn.onLoadEnd = function () {
		origin_onLoadEnd && origin_onLoadEnd();
		console.log('テーマ用？ janet.onLoadEnd();');
	};

	// 新着ツイート(画面表示前)
	// janet.onReceiveNewStatusesBefore(ツイートオブジェクトの配列);
	// 4.0.0.0b2で新規に追加。trueと判定される値を返却するとその後の処理を行わない
	var origin_onReceiveNewStatusesBefore = jn.onReceiveNewStatusesBefore;
	jn.onReceiveNewStatusesBefore = function (tweets) {
		var stop = false;
		if (origin_onReceiveNewStatusesBefore)
			stop = origin_onReceiveNewStatusesBefore(tweets);
		console.log('新着ツイート(画面表示前) janet.onReceiveNewStatusesBefore(tweets);');
		return stop;
	};

	// 新着ツイート(画面表示完了後)
	// janet.onReceiveNewStatusesAfter();
	// 4.0.0.0b2で新規に追加
	var origin_onReceiveNewStatusesAfter = jn.onReceiveNewStatusesAfter;
	jn.onReceiveNewStatusesAfter = function () {
		origin_onReceiveNewStatusesAfter && origin_onReceiveNewStatusesAfter();
		console.log('新着ツイート(画面表示完了後) janet.onReceiveNewStatusesAfter();');
	};

	// 新着ツイート通知(画面表示前)
	// janet.onReceiveNewTweetsBefore(ツイートオブジェクトの配列);
	// 4.0.0.0b2で新規に追加。trueと判定される値を返却するとその後の処理を行わない
	var origin_onReceiveNewTweetsBefore = jn.onReceiveNewTweetsBefore;
	jn.onReceiveNewTweetsBefore = function (tweets) {
		var stop = false;
		if (origin_onReceiveNewTweetsBefore)
			stop = origin_onReceiveNewTweetsBefore(tweets);
		console.log('新着ツイート通知(画面表示前) janet.onReceiveNewTweetsBefore(tweets);');
		return stop;
	};

	// 新着ツイート通知(画面表示完了後)
	// janet.onReceiveNewTweetsAfter();
	// 4.0.0.0b2で新規に追加
	var origin_onReceiveNewTweetsAfter = jn.onReceiveNewTweetsAfter;
	jn.onReceiveNewTweetsAfter = function () {
		origin_onReceiveNewTweetsAfter && origin_onReceiveNewTweetsAfter();
		console.log('新着ツイート通知(画面表示完了後) janet.onReceiveNewTweetsAfter();');
	};

	// イベント通知(画面表示前)
	// janet.onReceiveNewEventBefore(イベント内容オブジェクト);
	// 4.0.0.0b2で新規に追加。trueと判定される値を返却するとその後の処理を行わない
	var origin_onReceiveNewEventBefore = jn.onReceiveNewEventBefore;
	jn.onReceiveNewEventBefore = function (data) {
		var stop = false;
		if (origin_onReceiveNewEventBefore)
			stop = origin_onReceiveNewEventBefore(data);
		console.log('イベント通知(画面表示前) janet.onReceiveNewEventBefore(data);');
		return stop;
	};

	// イベント通知(画面表示後)
	// janet.onReceiveNewEventAfter();
	// 4.0.0.0b2で新規に追加
	var origin_onReceiveNewEventAfter = jn.onReceiveNewEventAfter;
	jn.onReceiveNewEventAfter = function () {
		origin_onReceiveNewEventAfter && origin_onReceiveNewEventAfter();
		console.log('イベント通知(画面表示後) janet.onReceiveNewEventAfter();');
	};

	// 設定メニュー
	// janet.onContextMemuOptionsBuildStarted(accounts);
	var origin_onContextMemuOptionsBuildStarted = jn.onContextMemuOptionsBuildStarted;
	jn.onContextMemuOptionsBuildStarted = function (accounts) {
		origin_onContextMemuOptionsBuildStarted && origin_onContextMemuOptionsBuildStarted(accounts);
		console.log('設定メニュー janet.onContextMemuOptionsBuildStarted(accounts);');
	};

	// 顔メニュー
	// janet.onContextMemuAllBuildStarted(accounts);
	var origin_onContextMemuAllBuildStarted = jn.onContextMemuAllBuildStarted;
	jn.onContextMemuAllBuildStarted = function (accounts) {
		origin_onContextMemuAllBuildStarted && origin_onContextMemuAllBuildStarted(accounts);
		console.log('顔メニュー janet.onContextMemuAllBuildStarted(accounts);');
	};

	// Gearメニュー
	// janet.onContextMemuGearBuildStarted(accounts);
	var origin_onContextMemuGearBuildStarted = jn.onContextMemuGearBuildStarted;
	jn.onContextMemuGearBuildStarted = function (accounts) {
		origin_onContextMemuGearBuildStarted && origin_onContextMemuGearBuildStarted(accounts);
		console.log('Gearメニュー janet.onContextMemuGearBuildStarted(accounts);');
	};

	// 返信メニュー
	// janet.onContextMemuReplyBuildStarted(accounts);
	var origin_onContextMemuReplyBuildStarted = jn.onContextMemuReplyBuildStarted;
	jn.onContextMemuReplyBuildStarted = function (accounts) {
		origin_onContextMemuReplyBuildStarted && origin_onContextMemuReplyBuildStarted(accounts);
		console.log('返信メニュー janet.onContextMemuReplyBuildStarted(accounts);');
	};

	// ☆メニュー
	// janet.onContextMemuFavBuildStarted(accounts);
	var origin_onContextMemuFavBuildStarted = jn.onContextMemuFavBuildStarted;
	jn.onContextMemuFavBuildStarted = function (accounts) {
		origin_onContextMemuFavBuildStarted && origin_onContextMemuFavBuildStarted(accounts);
		console.log('☆メニュー janet.onContextMemuFavBuildStarted(accounts);');
	};

	// RTメニュー
	// janet.onContextMemuRTBuildStarted(accounts);
	var origin_onContextMemuRTBuildStarted = jn.onContextMemuRTBuildStarted;
	jn.onContextMemuRTBuildStarted = function (accounts) {
		origin_onContextMemuRTBuildStarted && origin_onContextMemuRTBuildStarted(accounts);
		console.log('RTメニュー janet.onContextMemuRTBuildStarted(accounts);');
	};

	// @userメニュー
	// janet.onContextMemuAtUserBuildStarted(accounts);
	var origin_onContextMemuAtUserBuildStarted = jn.onContextMemuAtUserBuildStarted;
	jn.onContextMemuAtUserBuildStarted = function (accounts) {
		origin_onContextMemuAtUserBuildStarted && origin_onContextMemuAtUserBuildStarted(accounts);
		console.log('@userメニュー janet.onContextMemuAtUserBuildStarted(accounts);');
	};

	// アカウント選択メニュー
	// janet.onContextMemuSelectAccountBuildStarted(accounts);
	var origin_onContextMemuSelectAccountBuildStarted = jn.onContextMemuSelectAccountBuildStarted;
	jn.onContextMemuSelectAccountBuildStarted = function (accounts) {
		origin_onContextMemuSelectAccountBuildStarted && origin_onContextMemuSelectAccountBuildStarted(accounts);
		console.log('アカウント選択メニュー janet.onContextMemuSelectAccountBuildStarted(accounts);');
	};

	// タイムラインメニュー
	// janet.onContextMemuTimeLineBuildStarted(accounts);
	var origin_onContextMemuTimeLineBuildStarted = jn.onContextMemuTimeLineBuildStarted;
	jn.onContextMemuTimeLineBuildStarted = function (accounts) {
		origin_onContextMemuTimeLineBuildStarted && origin_onContextMemuTimeLineBuildStarted(accounts);
		console.log('タイムラインメニュー janet.onContextMemuTimeLineBuildStarted(accounts);');
	};

	// リンクメニュー
	// janet.onContextMemuLinkBuildStarted(accounts);
	var origin_onContextMemuLinkBuildStarted = jn.onContextMemuLinkBuildStarted;
	jn.onContextMemuLinkBuildStarted = function (accounts) {
		origin_onContextMemuLinkBuildStarted && origin_onContextMemuLinkBuildStarted(accounts);
		console.log('リンクメニュー janet.onContextMemuLinkBuildStarted(accounts);');
	};

	// 文字列選択メニュー
	// janet.onContextMemuSelectTextBuildStarted(accounts);
	var origin_onContextMemuSelectTextBuildStarted = jn.onContextMemuSelectTextBuildStarted;
	jn.onContextMemuSelectTextBuildStarted = function (accounts) {
		origin_onContextMemuSelectTextBuildStarted && origin_onContextMemuSelectTextBuildStarted(accounts);
		console.log('文字列選択メニュー janet.onContextMemuSelectTextBuildStarted(accounts);');
	};

	// #hashメニュー
	// janet.onContextMemuHashBuildStarted(accounts);
	var origin_onContextMemuHashBuildStarted = jn.onContextMemuHashBuildStarted;
	jn.onContextMemuHashBuildStarted = function (accounts) {
		origin_onContextMemuHashBuildStarted && origin_onContextMemuHashBuildStarted(accounts);
		console.log('#hashメニュー janet.onContextMemuHashBuildStarted(accounts);');
	};

	// viaメニュー
	// janet.onContextMemuViaBuildStarted(accounts);
	var origin_onContextMemuViaBuildStarted = jn.onContextMemuViaBuildStarted;
	jn.onContextMemuViaBuildStarted = function (accounts) {
		origin_onContextMemuViaBuildStarted && origin_onContextMemuViaBuildStarted(accounts);
		console.log('viaメニュー janet.onContextMemuViaBuildStarted(accounts);');
	};

	// Draftメニュー
	// janet.onContextMemuDraftBuildStarted(accounts);
	var origin_onContextMemuDraftBuildStarted = jn.onContextMemuDraftBuildStarted;
	jn.onContextMemuDraftBuildStarted = function (accounts) {
		origin_onContextMemuDraftBuildStarted && origin_onContextMemuDraftBuildStarted(accounts);
		console.log('Draftメニュー janet.onContextMemuDraftBuildStarted(accounts);');
	};

	// トレンドメニュー
	// janet.onContextMemuTrendsBuildStarted();
	var origin_onContextMemuTrendsBuildStarted = jn.onContextMemuTrendsBuildStarted;
	jn.onContextMemuTrendsBuildStarted = function () {
		origin_onContextMemuTrendsBuildStarted && origin_onContextMemuTrendsBuildStarted();
		console.log('トレンドメニュー janet.onContextMemuTrendsBuildStarted();');
	};

	// フォントサイズ変更時 (tweeteditor)
	// janet.editor.onChangeFontSize();
	if (jn.editor) {
		var origin_editor_onChangeFontSize = jn.editor.onChangeFontSize;
		jn.editor.onChangeFontSize = function () {
			origin_editor_onChangeFontSize && origin_editor_onChangeFontSize();
			console.log('フォントサイズ変更時 janet.editor.onChangeFontSize();');
		};
	}

	// console.log('eventcheck.js: End.');

})(jQuery, janet);
