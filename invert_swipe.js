//================================================
// スワイプ方向反転プラグイン
// Author: @iihoshi
//================================================
(function($, jn) {

	// プラグイン情報 ここから
	// プラグイン情報の初期化
	if(!jn.pluginInfo)
		jn.pluginInfo = {};
	// プラグイン情報本体
	jn.pluginInfo['invert_swipe'] = {
		'name' : {
			'ja' : 'スワイプ方向反転',
			'en' : 'Invert swipe direction'
		},
		'author' : {
			'en' : '@iihoshi'
		},
		'version' : '1.0.0',
		'file' : 'invert_swipe.js',
		'language' : ['de','en','es','ja','ko','pt','zh-CN'],
		'last_update' : '2013/2/2',
		'update_timezone' : '9',
		'jnVersion' : 'Mac 4.0.1 -',
		'description' : {
			'ja' : 'タイムラインやテーマを選択する際のスワイプ方向を反転できます。（Mac 版限定）',
			'en' : 'You can invert the swipe direction for selecting a timeline or theme. (For Mac only!)'
		},
		'updateinfo' : 'http://www.colorless-sight.jp/archives/JanetterPluginUpdateInfo.txt'
	};
	// プラグイン情報 ここまで

	// Mac 版以外は対象外
	if (_determinPlatform() != 'Mac')
		return;

	var _Resource = function(){};
	_Resource.prototype = {
		// 翻訳情報
		'msg': {
			'en': {
				'confInvertSwipe': 'Invert swipe direction',
				'confInvertSwipeTL': 'Timeline',
				'confInvertSwipeTheme': 'Theme'
			},
			'ja': {
				'confInvertSwipe': 'スワイプ方向の反転',
				'confInvertSwipeTL': 'タイムライン',
				'confInvertSwipeTheme': 'テーマ'
			}
		},
		// 設定画面用の HTML
		'configHTML': {
			'name': 'boxinvertswipe',	// must be the top-level class name below
			'value': '\
<hr>\
<div class="boxinvertswipe">\
<span class="conf-menu" transtext="confInvertSwipe"></span>\
<input class="check01" type="checkbox" action="invertSwipeTL">\
<span class="check text01" transtext="confInvertSwipeTL"></span>\
<input class="check02" type="checkbox" action="invertSwipeTheme">\
<span class="check text02" transtext="confInvertSwipeTheme"></span>\
</div>\
'
		},
		// 設定画面用の CSS
		'configCSS': {
			'name': 'invertswipe',		// must be the class name below
			'value': '\
<style type="text/css" class="invertswipe">\
<!--\
.conf-main > .tab06 > .boxinvertswipe {\
	height: 86px;\
}\
//-->\
</style>\
'
		}
	};

	var _rsrc = new _Resource();

	// 本プラグインの初期化処理
	function init() {
		// 設定値が無ければ初期化
		if (jn.conf) {
			if (jn.conf.invert_swipe_timeline == undefined)
				jn.conf.invert_swipe_timeline = false;
			if (jn.conf.invert_swipe_theme == undefined)
				jn.conf.invert_swipe_theme = false;
		}

		// 翻訳情報を追加
		// プラグイン読み込み時は既に onGetMessages() 実行済みのため、ここでの呼び出しが必要
		// (See: http://jbbs.livedoor.jp/bbs/read.cgi/internet/8173/1291895275/661)
		addTranslateData(_rsrc.msg);

		// 翻訳情報取得時の前処理
		var orig_onGetMessages = jn.onGetMessages;
		jn.onGetMessages = function(success, data) {
			addTranslateData(_rsrc.msg);
			orig_onGetMessages && orig_onGetMessages.apply(this, arguments);
		};

		// ウィンドウ別の初期化処理
		switch (_Janetter_Window_Type) {
			case "main":		// メイン画面
				// アクティブ TL 切替時の Swipe 方向を反転
				var onSwipeMain = function(dir) {
					dir == 'left' ?
						jn.shiftLeftTimeLine() :
						jn.shiftRightTimeLine();
				};
				jn.swipeLeft = function() {
					onSwipeMain(jn.conf.invert_swipe_timeline ? 'right' : 'left');
				};
				jn.swipeRight = function() {
					onSwipeMain(jn.conf.invert_swipe_timeline ? 'left' : 'right');
				};
				break;

			case "config":		// 設定画面
				// テーマ選択時の Swipe 方向を反転
				var onSwipeConfig = function(dir) {
					var page = $('#conf-content .conf-main > .tab02');
					if (page.hasClass('active')) {
						dir == 'left' ?
							$('.theme-gallery > .active', page).prev().trigger('click') :
							$('.theme-gallery > .active', page).next().trigger('click');
					}
				};
				jn.swipeLeft = function() {
					onSwipeConfig(jn.conf.invert_swipe_theme ? 'right' : 'left');
				};
				jn.swipeRight = function() {
					onSwipeConfig(jn.conf.invert_swipe_theme ? 'left' : 'right');
				};
				// 「高度な設定」タブに項目を追加して設定を反映
				$('head').append($(_rsrc.configCSS.value));
				$('#conf-content .conf-main > .tab06 > .box15').after(_rsrc.configHTML.value);
				jn.transMessage();
				// Advancedページ作成
				var orig_buildAdvanced = jn.configDialog.buildAdvanced;
				jn.configDialog.buildAdvanced = function() {
					orig_buildAdvanced && orig_buildAdvanced.apply(this, arguments);
					var box = $('#conf-content .conf-main > .tab06 .' + _rsrc.configHTML.name);
					$('.check01', box).prop('checked', jn.conf.invert_swipe_timeline);
					$('.check02', box).prop('checked', jn.conf.invert_swipe_theme);
				};
				jn.configDialog.buildAdvanced();
				// 設定画面でのアクション振り分け
				var orig_confDlg_action = jn.configDialog.action;
				jn.configDialog.action = function(act, elem, event) {
					// オリジナルと同様に、撥ねられるものは早々に撥ねる
					if ((elem.length == 0) || elem.prop('disabled'))
						return;
					switch (act) {
						// アクティブ TL 切替時の Swipe 方向反転
						case 'invertSwipeTL':
							jn.conf.invert_swipe_timeline = elem.prop('checked');
							syncConfig({
								configName: 'invert_swipe_timeline',
								configData: jn.conf.invert_swipe_timeline
							});
							break;
						// テーマ選択時の Swipe 方向反転
						case 'invertSwipeTheme':
							jn.conf.invert_swipe_theme = elem.prop('checked');
							syncConfig({
								configName: 'invert_swipe_theme',
								configData: jn.conf.invert_swipe_theme
							});
							break;
						// 既存の jn.configDialog.action を呼び出す
						default:
							orig_confDlg_action && orig_confDlg_action.apply(this, arguments);
							break;
					}
				};
				break;

			case "profile":		// プロフィール画面
			case "notice":		// 通知ポップアップ画面
			default:
				break;
		}

		console.log('invert_swipe.js has been initialized.');
	}

	// プラットフォームの判定 (@ginlime)
	function _determinPlatform(){
		return (navigator.userAgent.indexOf('Windows')>=0) ? 'Win' :
				(navigator.userAgent.indexOf('Macintosh')>=0) ? 'Mac' : 'other';
	}

	// メッセージの翻訳データを追加 (@ginlime)
	function addTranslateData(msg, additionalProc){
		var msgData = msg[jn.conf.lang];
		if(msgData == undefined)
			msgData = msg['en'];
		additionalProc && additionalProc(msgData);
		assignTo(jn.msg, msgData);
	}

	// 全置換 (@ginlime)
	String.prototype.replaceAll = function(org, dest){
		return this.split(org).join(dest);
	};

	// 指定文字数のランダム文字列を生成 (@ginlime)
	randomStr = function(len, additional){
		var srcAry = [],
		addLen = (additional) ? additional.length : 0,
		aryLen,
		resStr = '';
		for(var i = 0; i < 10; i++){
			srcAry.push(String.fromCharCode('0'.charCodeAt() + i));
		}
		for(var i = 0; i < 26; i++){
			srcAry.push(String.fromCharCode('A'.charCodeAt() + i));
		}
		for(var i = 0; i < 26; i++){
			srcAry.push(String.fromCharCode('a'.charCodeAt() + i));
		}
		if(additional){
			for(var i = 0; i < addLen; i++){
				var tmpChar = additional.charAt(i);
				if(tmpChar!="'" && tmpChar!='"')	// クォーテーション類は使用不可
					srcAry.push(tmpChar);
			}
		}
		aryLen = srcAry.length;
		for(var i = 0; i < len; i++){
			resStr += srcAry[Math.floor(Math.random()*aryLen)];
		}
		return resStr;
	};

	// 設定値の同期を取る (@ginlime)
	var isSrcProfileWindow = {};
	syncConfig = function(srcWindow, isSrcProfile, configName, configData, configIsBoole, funcExecOnMain, funcExecOnProf, funcExecOnConf, funcExecOnNotice, dontSave, profTrack){
		var dataIsEmpty = (configData==undefined),
			lackSrcProfile = (srcWindow=='profile' && isSrcProfile==undefined);
		if(typeof arguments[0]=='object'){
			isSrcProfile = arguments[0].isSrcProfile || (_Janetter_Window_Type=='profile');
			configName = arguments[0].configName || '';
			configData = arguments[0].configData;
			dataIsEmpty = (arguments[0].configData==undefined);
			configIsBoole = arguments[0].configIsBoole || (typeof configData == 'boolean');
			funcExecOnMain = arguments[0].funcExecOnMain || '';
			funcExecOnProf = arguments[0].funcExecOnProf || '';
			funcExecOnConf = arguments[0].funcExecOnConf || '';
			funcExecOnNotice = arguments[0].funcExecOnNotice || '';
			dontSave = arguments[0].dontSave || false;
			profTrack = '';
			srcWindow = arguments[0].srcWindow || _Janetter_Window_Type;
		}
		if(!srcWindow){
			console.warn('syncConfig：srcWindow が不足しています。');
			return false;
		}
		if(!configName){
			console.warn('syncConfig：configName が不足しています。');
			return false;
		}
		if(dataIsEmpty){
			console.warn('syncConfig：configData が不足しています。');
			return false;
		}
		if(lackSrcProfile){
			console.warn('syncConfig：isSrcProfile が不足しています。');
			return false;
		}
		isSrcProfile = (typeof isSrcProfile=='string') ?
							(isSrcProfile=='true') ?
								true :
								false :
							isSrcProfile;
		configIsBoole = (typeof configIsBoole=='string') ?
							(configIsBoole=='true') ?
								true :
								false :
							configIsBoole;
		dontSave = (typeof dontSave=='string') ?
							(dontSave=='true') ?
								true :
								false :
							dontSave;
		var configDataSave = configData;
		configDataSave = (configIsBoole && typeof configDataSave=='string') ?
							(configDataSave=='true') ?
								true :
								false :
							configDataSave;
		if(typeof configDataSave=='string'){
			if((srcWindow=='profile'&&isSrcProfile)||(srcWindow!='profile'&&srcWindow==_Janetter_Window_Type)){
				configData = configData.replaceAll('&','&amp;').replaceAll('"','&quot;');
			} else {
				configDataSave = configDataSave.replaceAll('&quot;','"').replaceAll('&amp;','&');
			}
		}
		jn.conf[configName] = configDataSave;
		switch(_Janetter_Window_Type){
			case 'main':
				if(!dontSave)
					jn.setConfig(jn.conf);
				jn.webViewAction('profJS', {cmd:'syncConfig("'+srcWindow+'",'+false+',"'+configName+'","'+configData+'",'+configIsBoole+',"","'+funcExecOnProf+'","","",'+false+',"'+profTrack+'")'});
				if(srcWindow!='config')
					jn.webViewAction('confJS', {cmd:'syncConfig("'+srcWindow+'",'+false+',"'+configName+'","'+configData+'",'+configIsBoole+',"","","'+funcExecOnConf+'","",'+false+',"'+profTrack+'")'});
				if(srcWindow!='notice')
					jn.webViewAction('noticeJS', {cmd:'syncConfig("'+srcWindow+'",'+false+',"'+configName+'","'+configData+'",'+configIsBoole+',"","","","'+funcExecOnNotice+'",'+false+',"'+profTrack+'")'});
				if(srcWindow!='main' && funcExecOnMain)
					eval(funcExecOnMain+'()');
				break;
			case 'profile':
				if(srcWindow=='profile' && isSrcProfile){
					var trackStr = randomStr(10);
					isSrcProfileWindow[trackStr] = true;
					jn.webViewAction('mainJS', {cmd:'syncConfig("profile",'+false+',"'+configName+'","'+configData+'",'+configIsBoole+',"'+funcExecOnMain+'","'+funcExecOnProf+'","'+funcExecOnConf+'","'+funcExecOnNotice+'",'+dontSave+',"'+trackStr+'")'});
				}
				if((srcWindow!='profile' || (profTrack!='' && !isSrcProfileWindow[profTrack])) && funcExecOnProf)
					eval(funcExecOnProf+'()');
				if(!isSrcProfile && isSrcProfileWindow[profTrack])
					isSrcProfileWindow[profTrack] = false;
				break;
			case 'config':
				if(srcWindow == 'config')
					jn.webViewAction('mainJS', {cmd:'syncConfig("config",'+false+',"'+configName+'","'+configData+'",'+configIsBoole+',"'+funcExecOnMain+'","'+funcExecOnProf+'","","'+funcExecOnNotice+'",'+dontSave+',"")'});
				else if(funcExecOnConf)
					eval(funcExecOnConf+'()');
				break;
			case 'notice':
				if(srcWindow == 'notice')
					jn.webViewAction('mainJS', {cmd:'syncConfig("notice",'+false+',"'+configName+'","'+configData+'",'+configIsBoole+',"'+funcExecOnMain+'","'+funcExecOnProf+'","'+funcExecOnConf+'","",'+dontSave+',"")'});
				else if(funcExecOnNotice)
					eval(funcExecOnNotice+'()');
				break;
		}
		return true;
	};

	// 初期化実行
	if (jn.temp.initialized) {
		// The original onInitializeDone() has already been called!
		init();
	}
	else {
		var orig_onInitDone = jn.onInitializeDone;
		jn.onInitializeDone = function() {
			orig_onInitDone && orig_onInitDone.apply(this, arguments);
			init();
		};
	}

})(jQuery, janet);
