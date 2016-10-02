(function ($, jn) {

	var my_filename = 'fix_thumbnails.js';

	if ((_Janetter_Window_Type != "main") && (_Janetter_Window_Type != "profile"))
		return;

	function initOnInitialized() {
		// Thanks to: https://y-dash.blogspot.jp/2016/03/janetterinstagram.html
		var orig_janetterThumbnail = $.fn.janetterThumbnail.toString();
		var re_instagram_exp = /^(.+\/https\?:\\\/\\\/)(\(instagr.+\/g,)$/m;

		if (re_instagram_exp.test(orig_janetterThumbnail)) {
			var replaced = orig_janetterThumbnail
				.replace(re_instagram_exp,
				         "$1(?:www\.)$2  // replaced by " + my_filename);
			// console.log(replaced);
			eval('$.fn.janetterThumbnail = ' + replaced);
		} else {
			new jn.msgdialog({
				title: my_filename,
				icon: '',
				message: 'Sorry, ' + my_filename+ ' cannot be installed.',
				buttons: [ janet.msg.ok ],
			});
		}
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
