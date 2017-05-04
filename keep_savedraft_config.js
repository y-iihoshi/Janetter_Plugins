//================================================
// 下書き保存要否設定を恒常化するプラグイン
// Author: @iihoshi
// Special Thanks: @ginlime
//================================================
(function($, jn) {

	// プラグイン情報 ここから
	// プラグイン情報の初期化
	if(!jn.pluginInfo)
		jn.pluginInfo = {};
	// プラグイン情報本体
	jn.pluginInfo['keep_savedraft_config'] = {
		'name' : {
			'ja' : '下書き保存要否設定の恒常化',
			'en' : 'Keep "Save draft" configuration'
		},
		'author' : {
			'en' : '@iihoshi'
		},
		"version" : "1.1.0",
		'file' : 'keep_savedraft_config.js',
		'language' : ['de','en','es','ja','ko','pt','zh-CN'],
		"last_update" : "2013/1/20",
		'update_timezone' : '9',
		'jnVersion' : '4.0.1.0 -',
		'description' : {
			'ja' : 'ツイート欄を閉じた時に、ツイートを常に下書き保存するか、常に保存しないか、毎回選択するかを設定できるようになります。',
			'en' : 'You can configure that when you close the tweet box you always save the tweet as a draft or always not save.'
		},
		'updateinfo' : 'http://www.colorless-sight.jp/archives/JanetterPluginUpdateInfo.txt'
	};
	// プラグイン情報 ここまで

	var _ksdcClass = function(){};
	_ksdcClass.prototype = {
		// メッセージ
		'msg': {
			'en': {
				'confSaveDraft': "Save draft:",
				'confSaveDraftDefault': "Select every time (Default)",
				'confSaveDraftAlways': "Always save",
				'confSaveDraftAlwaysNot': "Always not save",
			},
			'ja': {
				'confSaveDraft': "下書き保存:",
				'confSaveDraftDefault': "毎回選択する（既定動作）",
				'confSaveDraftAlways': "常に保存する",
				'confSaveDraftAlwaysNot': "常に保存しない",
			},
		},
		// 設定画面用の HTML
		'configHTML': '\
<div class="boxksdc">\
<span class="menu01" transtext="confSaveDraft"></span>\
<div class="bevel">\
<input class="radio-default" type="radio" name="saveDraft" value="default">\
<span class="check text-default" transtext="confSaveDraftDefault"></span>\
<input class="radio-always" type="radio" name="saveDraft" value="always">\
<span class="check text-always" transtext="confSaveDraftAlways"></span>\
<input class="radio-always-not" type="radio" name="saveDraft" value="always-not">\
<span class="check text-always-not" transtext="confSaveDraftAlwaysNot"></span>\
</div>\
</div>\
',
		// 設定画面用の CSS
		'configCSS': '\
<style type="text/css" class="keepsavedraftconfig">\
<!--\
.conf-main > .tab06 > .boxksdc {\
	height: 100px;\
}\
.conf-main > .tab06 > .boxksdc .menu01 {\
	top: 0;\
}\
.conf-main > .tab06 > .boxksdc .bevel {\
	top: 0;\
	left: 170px;\
	width: 280px;\
}\
.conf-main > .tab06 > .boxksdc .radio-default {\
	position: absolute;\
	top: 12px;\
	left: 12px;\
}\
.conf-main > .tab06 > .boxksdc .text-default {\
	position: absolute;\
	top: 10px;\
	left: 32px;\
}\
.conf-main > .tab06 > .boxksdc .radio-always {\
	position: absolute;\
	top: 42px;\
	left: 12px;\
}\
.conf-main > .tab06 > .boxksdc .text-always {\
	position: absolute;\
	top: 40px;\
	left: 32px;\
}\
.conf-main > .tab06 > .boxksdc .radio-always-not {\
	position: absolute;\
	top: 72px;\
	left: 12px;\
}\
.conf-main > .tab06 > .boxksdc .text-always-not {\
	position: absolute;\
	top: 70px;\
	left: 32px;\
}\
//-->\
</style>\
'
	};

	var _ksdc = new _ksdcClass();

	if (jn.temp.initialized) {
		// The original onInitializeDone() has already been called!
		ksdcInit();
	}
	else {
		var orig_onInitDone = jn.onInitializeDone;
		jn.onInitializeDone = function() {
			orig_onInitDone && orig_onInitDone.apply(this, arguments);
			ksdcInit();
		};
	}

	// 本プラグインを初期化
	function ksdcInit() {
		// 本プラグインの設定値が無ければ初期化
		if (jn.conf) {
			if (jn.conf.ksdc_save_draft == undefined)
				jn.conf.ksdc_save_draft = "default";
		}

		// 本プラグインの翻訳情報を追加
		// プラグイン読み込み時は既に onGetMessages() 実行済みのため、ここでの呼び出しが必要
		// (See: http://jbbs.livedoor.jp/bbs/read.cgi/internet/8173/1291895275/661)
		addTranslateData(_ksdc.msg);

		// 翻訳情報取得時の前処理
		var orig_onGetMessages = jn.onGetMessages;
		jn.onGetMessages = function(success, data) {
			addTranslateData(_ksdc.msg);
			orig_onGetMessages && orig_onGetMessages.apply(this, arguments);
		};

		// ウィンドウ別の初期化処理
		switch (_Janetter_Window_Type) {
			case "main":		// メイン画面
				// 確認ダイアログの表示
				var orig_confirmEx = jn.confirmEx;
				jn.confirmEx = function(msg, done, buttons, icon) {
					if (msg == jn.msg.confirmSaveDraft) {
						switch (jn.conf.ksdc_save_draft) {
							case "always":		// 常に保存する
								done && done(jn.msg.yes);
								break;
							case "always-not":	// 常に保存しない
								done && done(jn.msg.no);
								break;
							case "default":		// 毎回選択する（既定動作）
							default:
								orig_confirmEx && orig_confirmEx.apply(this, arguments);
								break;
						}
					}
					else {
						orig_confirmEx && orig_confirmEx.apply(this, arguments);
					}
				};
				break;

			case "config":		// 設定画面
				// 「高度な設定」タブに項目を追加して設定を反映
				$('body').append($(_ksdc.configCSS));
				$('.conf-main > .tab06 > .box01').after(_ksdc.configHTML);
				jn.transMessage();
				// Advancedページ作成
				var orig_buildAdvanced = jn.configDialog.buildAdvanced;
				jn.configDialog.buildAdvanced = function() {
					orig_buildAdvanced && orig_buildAdvanced.apply(this, arguments);
					var page = $('#conf-content .conf-main > .tab06');
					$('.boxksdc > .bevel > :radio[value=' + jn.conf.ksdc_save_draft + ']', page).prop('checked', true);
				};
				jn.configDialog.buildAdvanced();
				// 設定画面でのアクション振り分け
				var orig_confDlg_action = jn.configDialog.action;
				jn.configDialog.action = function(act, elem, event) {
					// オリジナルと同様に、撥ねられるものは早々に撥ねる
					if ((elem.length == 0) || elem.prop('disabled'))
						return;
					switch (act) {
						// 下書き保存方法
						case 'saveDraft':
							jn.conf.ksdc_save_draft = elem.val();
							syncConfig({
								configName: 'ksdc_save_draft',
								configData: jn.conf.ksdc_save_draft
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

		console.log('keep_savedraft_config.js has been initialized.');
	}

	// メッセージの翻訳データを追加 (@ginlime)
	function addTranslateData(msg, additionalProc){
		var msgData = msg[jn.conf.lang];
		if(msgData == undefined)
			msgData = msg['en'];
		additionalProc && additionalProc(msgData);
		assignTo(jn.msg, msgData);
	};

	// 全置換 (@ginlime)
	String.prototype.replaceAll = function(org, dest){
		return this.split(org).join(dest);
	}

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
	}

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

})(jQuery, janet);
