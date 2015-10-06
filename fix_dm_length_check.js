(function ($, jn) {

	if (_Janetter_Window_Type != "main")
		return;

	function initOnInitialized() {
		// Thanks to @rilponi, who pointed out this root cause.
		var orig_postTweet = jn.editor.postTweet.toString();
		var re_lengthCheck = /(\}else if\(len > this\.charsMaxLength)(\)\{)/m;
		if (re_lengthCheck.test(orig_postTweet)) {
			var replaced = orig_postTweet.replace(re_lengthCheck, "$1DM$2");
			eval('jn.editor.postTweet = ' + replaced);
		}
	}

	if (jn.temp.initialized) {
		initOnInitialized();
	} else {
		var orig_onInitDone = jn.onInitializeDone;
		jn.onInitializeDone = function () {
			orig_onInitDone && orig_onInitDone.apply(this, arguments);
			initOnInitialized();
		};
	}

})(jQuery, janet);
