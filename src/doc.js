const fire = new Promise((res, rej) => {
	if (document.readyState === 'complete') {
		res(document);
	} else {
		const loader = (evt) => {
			if (evt.target.readyState === 'complete') {
				res(document);
				document.removeEventListener('readystatechange', loader);
			}
		};
		document.addEventListener('readystatechange', loader, false);
	}
});

/**
 * Bootstrap the HTML document.
 * 
 * Calls fn passing in the document once it is loaded and ready.
 * 
 * @param {function(Document)} fn
 * @void
 */
export const bootstrap = (fn) => fire.then(fn);
