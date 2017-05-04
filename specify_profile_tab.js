//================================================
// プロフィール初期表示タブ指定プラグイン
// Author: @iihoshi
//================================================
(function($, jn) {

	// プラグイン情報 ここから
	// プラグイン情報の初期化
	if(!jn.pluginInfo)
		jn.pluginInfo = {};
	// プラグイン情報本体
	jn.pluginInfo['specify_profile_tab'] = {
		'name' : {
			'ja' : 'プロフィール初期表示タブ指定',
			'en' : 'Specifying profile tab'
		},
		'author' : {
			'en' : '@iihoshi'
		},
		'version' : '1.0.0',
		'file' : 'specify_profile_tab.js',
		'language' : ['de','en','es','ja','ko','pt','zh-CN'],
		'last_update' : '2013/2/9',
		'update_timezone' : '9',
		'jnVersion' : 'Win: 4.2.1.1 -, Mac: 4.0.1 -',
		'description' : {
			'ja' : 'プロフィール画面を開いた時に初期表示されるタブを指定できます。',
			'en' : 'You can specify the initial displaying tab of profile windows.'
		},
		'updateinfo' : 'http://www.colorless-sight.jp/archives/JanetterPluginUpdateInfo.txt'
	};
	// プラグイン情報 ここまで

	var _Resource = function(){};
	_Resource.prototype = {
		// 翻訳情報
		'msg': {
			'en': {
				'confSpecProfTab': 'Specifying profile tab',
				'confSpecProfTabEnable': 'Specify the initial tab of profile windows'
			},
			'ja': {
				'confSpecProfTab': 'プロフィール初期表示タブ指定',
				'confSpecProfTabEnable': 'プロフィール画面を開いた時に初期表示するタブを指定する'
			}
		},
		// 設定画面用の HTML
		'configHTML': '\
<hr>\
<div class="boxspecproftab">\
<span class="conf-menu" transtext="confSpecProfTab"></span>\
<input class="check01" type="checkbox" action="specProfTabEnable">\
<span class="check text01" transtext="confSpecProfTabEnable"></span>\
<select class="comb01" action="specProfTabSelect" size="1">\
<option value="tab01" transtext="profTabProfile"></option>\
<option value="tab02" transtext="profTabTimeline"></option>\
<option value="tab03" transtext="profTabMentions"></option>\
<option value="tab04" transtext="profTabFavorites"></option>\
<option value="tab05" transtext="profTabRetweets"></option>\
<option value="tab06" transtext="profTabFollowers"></option>\
<option value="tab07" transtext="profTabFollowing"></option>\
</select>\
</div>\
',
		// 設定画面用の CSS
		'configCSS': '\
<style type="text/css" class="specproftab">\
<!--\
.conf-main > .tab06 > .boxspecproftab {\
	height: 86px;\
}\
.conf-main > .tab06 > .boxspecproftab .comb01 {\
	position: absolute;\
	top: 64px;\
	left: 80px;\
}\
//-->\
</style>\
'
	};

	var _rsrc = new _Resource();

	// 本プラグインの初期化処理 (pluginLoad 時)
	function initOnLoad() {
		// T.B.D.
	}

	// 本プラグインの初期化処理 (onInitialized 時)
	function initOnInitialized() {
		// 設定値が無ければ初期化
		if (jn.conf) {
			if (jn.conf.specproftab_enabled == undefined)
				jn.conf.specproftab_enabled = false;
			if (jn.conf.specproftab_tab == undefined)
				jn.conf.specproftab_tab = 'tab01';
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

		// プロフィールを開く処理の乗っ取り
		var orig_openProfile = jn.openProfile;
		jn.openProfile = function(screen_name, juid, page) {
			// 既にタブ指定済みの場合は上書きしない
			if (typeof page != 'string' && jn.conf.specproftab_enabled)
				page = jn.conf.specproftab_tab;
			orig_openProfile && orig_openProfile(screen_name, juid, page);
		};

		// ウィンドウ別の初期化処理
		switch (_Janetter_Window_Type) {
			case "config":		// 設定画面
				// 「高度な設定」タブに項目を追加して設定を反映
				$('head').append($(_rsrc.configCSS));
				$('#conf-content .conf-main > .tab06 > .box15').after(_rsrc.configHTML);
				jn.transMessage();
				// Advancedページ作成
				var orig_buildAdvanced = jn.configDialog.buildAdvanced;
				jn.configDialog.buildAdvanced = function() {
					orig_buildAdvanced && orig_buildAdvanced.apply(this, arguments);
					var box = $('#conf-content .conf-main > .tab06 .boxspecproftab');
					$('.check01', box).prop('checked', jn.conf.specproftab_enabled);
					$('.comb01', box).prop('disabled', !jn.conf.specproftab_enabled);
					if (_determinPlatform() == 'Win')
						$('.comb01 > option[value="tab05"]', box).remove();
					$('.comb01 > option[value="' + jn.conf.specproftab_tab + '"]', box).prop('selected', true);
				};
				jn.configDialog.buildAdvanced();
				// 設定画面でのアクション振り分け
				var orig_confDlg_action = jn.configDialog.action;
				jn.configDialog.action = function(act, elem, event) {
					// オリジナルと同様に、撥ねられるものは早々に撥ねる
					if ((elem.length == 0) || elem.prop('disabled'))
						return;
					switch (act) {
						// 初期表示タブ指定の有効/無効
						case 'specProfTabEnable':
							var box = $('#conf-content .conf-main > .tab06 .boxspecproftab');
							jn.conf.specproftab_enabled = elem.prop('checked');
							$('.comb01', box).prop('disabled', !jn.conf.specproftab_enabled);
							syncConfig({
								configName: 'specproftab_enabled',
								configData: jn.conf.specproftab_enabled
							});
							break;
						// 初期表示タブの選択
						case 'specProfTabSelect':
							jn.conf.specproftab_tab = elem.val();
							syncConfig({
								configName: 'specproftab_tab',
								configData: jn.conf.specproftab_tab
							});
							break;
						// 他は既定動作
						default:
							orig_confDlg_action && orig_confDlg_action.apply(this, arguments);
							break;
					}
				};
				break;

			case "main":		// メイン画面
			case "profile":		// プロフィール画面
			case "notice":		// 通知ポップアップ画面
			default:
				break;
		}

		console.log('specify_profile_tab.js has been initialized.');
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
	initOnLoad();
	if (jn.temp.initialized) {
		// The original onInitializeDone() has already been called!
		initOnInitialized();
	}
	else {
		var orig_onInitDone = jn.onInitializeDone;
		jn.onInitializeDone = function() {
			orig_onInitDone && orig_onInitDone.apply(this, arguments);
			initOnInitialized();
		};
	}

})(jQuery, janet);
