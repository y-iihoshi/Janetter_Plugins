//================================================
// タイムラインタイトルクリック時の動作を追加
// Author: @iihoshi
//================================================
(function($, jn) {

	// プラグイン情報 ここから
	// プラグイン情報の初期化
	if(!jn.pluginInfo)
		jn.pluginInfo = {};
	// プラグイン情報本体
	jn.pluginInfo['on_tl_title_click'] = {
		'name' : {
			'ja' : 'タイムラインタイトルクリック時の動作を追加',
			'en' : 'Add the action triggered by clicking on a timeline title'
		},
		'author' : {
			'en' : '@iihoshi'
		},
		'version' : '1.1.0',
		'file' : 'on_tl_title_click.js',
		'language' : ['en','ja'],
		'last_update' : '2013/3/24',
		'update_timezone' : '9',
		'jnVersion' : 'Win 4.2.2.0 -, Mac 4.0.1 -',
		'description' : {
			'ja' : 'タイムラインのタイトルをクリックした時の動作を設定できます。',
			'en' : 'You can configure the action triggered by clicking on a timeline title.'
		},
		'updateinfo' : 'http://www.colorless-sight.jp/archives/JanetterPluginUpdateInfo.txt'
	};
	// プラグイン情報 ここまで

	var _Resource = function(){};
	_Resource.prototype = {
		// 翻訳情報
		// jn.msg.jumpLatestTweet や jn.msg.jumpFirstUnread を使わないのは、
		// last と latest の違いを en/ja 以外で簡潔に表現できる自信が無いから。
		'msg': {
			'en': {
				'ottcMenu': "When you click the timeline title:",
				'ottcLeft': "Left click:",
				'ottcMiddle': "Middle click:",
				'ottcDouble': "Left double-click:",
				'ottcTimeout': "Double-click timeout:",
				'ottcNone': "Do nothing",
				'ottcLast': "Jump to Last Tweet",
				'ottcLatest': "Jump to Latest Tweet",
				'ottcUnread': "Jump to First Unread",
				'ottcNoneTip': "Default for Windows/Mac version",
				'ottcLastTip': "Just like iOS/Android version",
				'ottcLatestTip': 'Same as the keyboard shortcut "."',
				'ottcUnreadTip': 'Same as the keyboard shortcut ","'
			},
			'ja': {
				'ottcMenu': "タイムラインタイトルをクリックしたときの動作:",
				'ottcLeft': "左クリック:",
				'ottcMiddle': "中クリック:",
				'ottcDouble': "左ダブルクリック:",
				'ottcTimeout': "ダブルクリック判定時間:",
				'ottcNone': "何もしない",
				'ottcLast': "取得済み最新ツイートへ移動",
				'ottcLatest': "最新のツイートへ移動",
				'ottcUnread': "最初の未読へ移動",
				'ottcNoneTip': "Windows/Mac 版の既定動作",
				'ottcLastTip': "iOS/Android 版と同様の動作",
				'ottcLatestTip': 'キーボード ショートカット "." と同一',
				'ottcUnreadTip': 'キーボード ショートカット "," と同一'
			}
		},
		// 設定画面用の HTML
		'configHTML': '\
<div class="boxottc">\
<span class="conf-menu" transtext="ottcMenu"></span>\
<span class="menu01" transtext="ottcLeft"></span>\
<select class="comb-left" action="on_tl_title_click" size="1">\
<option value="none" transtext="ottcNone" transtitle="ottcNoneTip"></option>\
<option value="last" transtext="ottcLast" transtitle="ottcLastTip"></option>\
<option value="latest" transtext="ottcLatest" transtitle="ottcLatestTip"></option>\
<option value="unread" transtext="ottcUnread" transtitle="ottcUnreadTip"></option>\
</select>\
<span class="menu02" transtext="ottcMiddle"></span>\
<select class="comb-middle" action="on_tl_title_midclick" size="1">\
<option value="none" transtext="ottcNone" transtitle="ottcNoneTip"></option>\
<option value="last" transtext="ottcLast" transtitle="ottcLastTip"></option>\
<option value="latest" transtext="ottcLatest" transtitle="ottcLatestTip"></option>\
<option value="unread" transtext="ottcUnread" transtitle="ottcUnreadTip"></option>\
</select>\
<span class="menu03" transtext="ottcDouble"></span>\
<select class="comb-double" action="on_tl_title_dblclick" size="1">\
<option value="none" transtext="ottcNone" transtitle="ottcNoneTip"></option>\
<option value="last" transtext="ottcLast" transtitle="ottcLastTip"></option>\
<option value="latest" transtext="ottcLatest" transtitle="ottcLatestTip"></option>\
<option value="unread" transtext="ottcUnread" transtitle="ottcUnreadTip"></option>\
</select>\
<span class="menu04" transtext="ottcTimeout"></span>\
<input class="edit-timeout" type="text" action="on_tl_title_dblclick_timeout">\
<span class="menu04 unit">ms</span>\
</div>\
<hr>\
',
		// 設定画面用の CSS
		'configCSS': '\
<style type="text/css" class="tltitleclick">\
<!--\
.conf-main > .tab06 > .boxottc {\
	height: 144px;\
}\
.conf-main > .tab06 > .boxottc > .comb-left {\
	position: absolute;\
	top: 30px;\
	left: 200px;\
	width: 200px;\
}\
.conf-main > .tab06 > .boxottc > .comb-middle {\
	position: absolute;\
	top: 60px;\
	left: 200px;\
	width: 200px;\
}\
.conf-main > .tab06 > .boxottc > .comb-double {\
	position: absolute;\
	top: 90px;\
	left: 200px;\
	width: 200px;\
}\
.conf-main > .tab06 > .boxottc > .edit-timeout {\
	position: absolute;\
	top: 126px;\
	left: 200px;\
	width: 90px;\
	padding: 0 5px;\
	text-align: right;\
}\
.conf-main > .tab06 > .boxottc > .menu04.unit {\
	left: 306px;\
}\
//-->\
</style>\
'
	};

	var _rsrc = new _Resource();

	// 本プラグインの初期化処理 (pluginLoad 時)
	function initOnLoad() {
		// 本プラグインの翻訳情報を追加
		// プラグイン読み込み時は既に onGetMessages() 実行済みのため、ここでの呼び出しが必要
		// (See: http://jbbs.livedoor.jp/bbs/read.cgi/internet/8173/1291895275/661)
		addTranslateData(_rsrc.msg);

		// 翻訳情報取得時の前処理
		var orig_onGetMessages = jn.onGetMessages;
		jn.onGetMessages = function(success, data) {
			addTranslateData(_rsrc.msg);
			orig_onGetMessages && orig_onGetMessages.apply(this, arguments);
			if (_Janetter_Window_Type == 'config')
				resetConfigCSS();
		};

		// ウィンドウ別の初期化処理
		switch (_Janetter_Window_Type) {
		case "config":		// 設定画面
			// Advanced ページ作成
			var orig_cfgDlg_buildAdvanced = jn.configDialog.buildAdvanced;
			jn.configDialog.buildAdvanced = function() {
				orig_cfgDlg_buildAdvanced && orig_cfgDlg_buildAdvanced.apply(this, arguments);
				var box = $('#conf-content .conf-main > .tab06 .boxottc');
				$('.comb-left > option[value="' + jn.conf.on_tl_title_click + '"]', box).prop('selected', true);
				$('.comb-middle > option[value="' + jn.conf.on_tl_title_midclick + '"]', box).prop('selected', true);
				$('.comb-double > option[value="' + jn.conf.on_tl_title_dblclick + '"]', box).prop('selected', true);
				$('.edit-timeout', box).val(jn.conf.on_tl_title_dblclick_timeout);
			};
			// Mac 版では設定画面 close 時に focus が移動しないため、
			// .edit-timeout の設定更新のトリガーが change だけでは不十分
			if (_determinPlatform() == 'Mac') {
				// Advanced 設定保存
				var orig_cfgDlg_saveAdvanced = jn.configDialog.saveAdvanced;
				jn.configDialog.saveAdvanced = function() {
					// ここでは syncConfig() 実行禁止
					var box = $('#conf-content .conf-main > .tab06 .boxottc');
					jn.conf.on_tl_title_dblclick_timeout = $('.edit-timeout', box).val();
					orig_cfgDlg_saveAdvanced && orig_cfgDlg_saveAdvanced.apply(this, arguments);
				};
			}
			// 設定画面でのアクション振り分け
			var orig_cfgDlg_action = jn.configDialog.action;
			jn.configDialog.action = function(act, elem, event) {
				// オリジナルと同様に、撥ねられるものは早々に撥ねる
				if ((elem.length == 0) || elem.prop('disabled'))
					return;
				switch (act) {
				case 'on_tl_title_click':
				case 'on_tl_title_midclick':
				case 'on_tl_title_dblclick':
				case 'on_tl_title_dblclick_timeout':
					jn.conf[act] = elem.val();
					syncConfig({configName: act, configData: jn.conf[act]});
					break;
				default:
					orig_cfgDlg_action && orig_cfgDlg_action.apply(this, arguments);
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
	}

	// 本プラグインの初期化処理 (onInitializeDone 時)
	function initOnInitialized() {
		// 本プラグインの設定値が無ければ初期化
		if (jn.conf) {
			if (jn.conf.on_tl_title_click == undefined)
				jn.conf.on_tl_title_click = 'last';
			if (jn.conf.on_tl_title_midclick == undefined)
				jn.conf.on_tl_title_midclick = 'unread';
			if (jn.conf.on_tl_title_dblclick == undefined)
				jn.conf.on_tl_title_dblclick = 'latest';
			if (jn.conf.on_tl_title_dblclick_timeout == undefined)
				jn.conf.on_tl_title_dblclick_timeout = 200;
		}

		// ウィンドウ別の初期化処理
		switch (_Janetter_Window_Type) {
		case "main":		// メイン画面
			$('#timeline-view .timeline-title-text').single_double_click(function(e) {
				// 修飾キー押下無しの左/中クリックでのみ発火
				if (!isModKeyPressed(e) && (e.which == 1 || e.which == 2))
					jumpTo({
						target: (e.which == 1
							? jn.conf.on_tl_title_click
							: jn.conf.on_tl_title_midclick),
						timeline: $(this).closest('li.timeline-container'),
						event: e
					});
			}, function(e) {
				// 修飾キー押下無しの左ダブルクリックでのみ発火
				if (!isModKeyPressed(e) && (e.which == 1))
					jumpTo({
						target: jn.conf.on_tl_title_dblclick,
						timeline: $(this).closest('li.timeline-container'),
						event: e
					});
			}, function() {
				return jn.conf.on_tl_title_dblclick_timeout;
			});
			break;

		case "config":		// 設定画面
			// 「高度な設定」タブに項目を追加して設定を反映
			resetConfigCSS();
			$('.conf-main > .tab06 > .box04').before(_rsrc.configHTML);
			jn.configDialog.buildAdvanced();
			jn.transMessage($('.conf-main > .tab06'));
			// テキストボックスの click ではなく change で action 発動
			$('.conf-main > .tab06 > .boxottc > .edit-timeout')
			.click(false)
			.change(function(e) {
				var elem = $(e.srcElement);
				jn.configDialog.action(elem.attr('action'), elem, e);
			});
			break;

		case "profile":		// プロフィール画面
		case "notice":		// 通知ポップアップ画面
		default:
			break;
		}

		console.log('on_tl_title_click.js has been initialized.');
	}

	// 修飾キーが 1 つ以上押下されているか
	function isModKeyPressed(event) {
		// jQuery API Documentation には metaKey しか記載が無いけど...
		return (event.metaKey || event.shiftKey || event.ctrlKey || event.altKey);
	}

	// options.timeline の options.target へ移動
	function jumpTo(options) {
		var timeline = options.timeline,
			target = options.target,
			event = options.event;
		switch (target) {
		case 'last':
			timeline.get(0).controller.scroll.toLatest();
			break;
		case 'latest':
		case 'unread':
			jn.action({act: ('jump' + target), element: timeline, event: event});
			break;
		case 'none':
		default:
			// Do nothing
			break;
		}
	}

	// 設定画面用 CSS を（再）設定
	function resetConfigCSS() {
		$('style.tltitleclick').remove();
		$('head').append($(_rsrc.configCSS));
	}

	// Author: Jacek Becela
	// Source: http://gist.github.com/399624
	// License: MIT
	// Modified by @iihoshi
	//   変数名 jQuery を $ に置換
	//   第 3 引数を callback 関数化 ... ハンドラ再登録無しで Timeout 値を変更可にするため
	$.fn.single_double_click = function(single_click_callback, double_click_callback, timeout_callback) {
		return this.each(function(){
			var clicks = 0, self = this;
			$(this).click(function(event){
				clicks++;
				if (clicks == 1) {
					setTimeout(function(){
						if(clicks == 1) {
							single_click_callback.call(self, event);
						} else {
							double_click_callback.call(self, event);
						}
						clicks = 0;
					}, timeout_callback.call(self));
				}
			});
		});
	};

	// プラットフォームの判定 (@ginlime)
	function _determinPlatform(){
			return (navigator.userAgent.indexOf('Windows')>=0) ? 'Win' :
					(navigator.userAgent.indexOf('Macintosh')>=0) ? 'Mac' : 'other';
	}

	// メッセージの翻訳データを追加 (@ginlime)
	addTranslateData = function(msg, additionalProc){
		var msgData = msg[jn.conf.lang];
		if(msgData == undefined)
			msgData = msg['en'];
		additionalProc && additionalProc(msgData);
		assignTo(jn.msg, msgData);
	};

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
		var orig_onInitializeDone = jn.onInitializeDone;
		jn.onInitializeDone = function() {
			orig_onInitializeDone && orig_onInitializeDone.apply(this, arguments);
			initOnInitialized();
		};
	}

})(jQuery, janet);
