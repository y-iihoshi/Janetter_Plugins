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

	// Thanks to: http://potato.2ch.net/test/read.cgi/software/1438689601/763
	function fixPixiv() {
		var original = this.toString();
		var re_pixiv = /function pixiv\(permalink\){[^]*?^\t\t}$/m;
		if (re_pixiv.test(original)) {
			var pixiv = re_pixiv.exec(original)[0];
			var re_pixiv_cond = /if\(link && thumb_url && title\){$/m;
			var re_pixiv_link = /link: link\[1\]\.htmlDecode\(\),$/m;
			if (re_pixiv_cond.test(pixiv) && re_pixiv_link.test(pixiv)) {
				var replaced_pixiv = pixiv 
					.replace(re_pixiv_cond, "if(thumb_url && title){" + comment)
					.replace(re_pixiv_link, "link: url," + comment);
				return original.replace(re_pixiv, replaced_pixiv);
			} else {
				return original;
			}
		} else {
			return original;
		}
	}

	function initOnInitialized() {
		String.prototype.fixInstagram = fixInstagram;
		String.prototype.fixPixiv = fixPixiv;

		var orig_janetterThumbnail = $.fn.janetterThumbnail.toString();
		var replaced = orig_janetterThumbnail.fixInstagram().fixPixiv();
		// console.log(replaced);
		eval('$.fn.janetterThumbnail = ' + replaced);

		delete String.prototype.fixPixiv;
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
