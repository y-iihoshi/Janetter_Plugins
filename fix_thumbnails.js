(function ($, jn) {

	if ((_Janetter_Window_Type != "main") && (_Janetter_Window_Type != "profile"))
		return;

	var my_filename = 'fix_thumbnails.js';
	var comment = '  // replaced by ' + my_filename;

	// Thanks to: https://y-dash.blogspot.jp/2016/03/janetterinstagram.html
	function fixInstagram() {
		var original = this.toString();
		var re_instagram_exp = /^(.+\/https\?:\\\/\\\/)(\(instagr.+\/g,)$/m;
		return re_instagram_exp.test(original)
			? original.replace(re_instagram_exp, "$1(?:www\.)$2" + comment)
			: original;
	}

	function initOnInitialized() {
		String.prototype.fixInstagram = fixInstagram;

		var orig_janetterThumbnail = $.fn.janetterThumbnail.toString();
		var replaced = orig_janetterThumbnail.fixInstagram();
		// console.log(replaced);
		eval('$.fn.janetterThumbnail = ' + replaced);

		delete String.prototype.fixInstagram;
	}

	if (jn.temp.initialized) {
		initOnInitialized();
	} else {
		var orig_onInitDone = jn.onInitializeDone;
		jn.onInitializeDone = function() {
			orig_onInitDone && orig_onInitDone.apply(this, arguments);
			initOnInitialized();
		};
	}

})(jQuery, janet);
