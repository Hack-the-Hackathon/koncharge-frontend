/**
 * A class to manage browser cookies.
 */
class CookieManager {
	/**
	 * Sets a cookie with the specified name, value, and expiration in days.
	 *
	 * @param {string} name - The name of the cookie.
	 * @param {string} value - The value of the cookie.
	 * @param {number} [days] - The number of days until the cookie expires. If not set, the cookie will be a session cookie.
	 */
	setCookie(name, value, days) {
		let expires = '';
		if (days) {
			const date = new Date();
			date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
			expires = '; expires=' + date.toUTCString();
		}
		document.cookie = name + '=' + (value || '') + expires + '; path=/';
	}

	/**
	 * Retrieves the value of the cookie with the specified name.
	 *
	 * @param {string} name - The name of the cookie to retrieve.
	 * @returns {string|null} The value of the cookie if it exists, otherwise null.
	 */
	getCookie(name) {
		const nameEQ = name + '=';
		const ca = document.cookie.split(';');
		for (let i = 0; i < ca.length; i++) {
			let c = ca[i];
			while (c.charAt(0) === ' ') c = c.substring(1, c.length);
			if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
		}
		return null;
	}

	/**
	 * Checks if a cookie with the specified name exists.
	 *
	 * @param {string} name - The name of the cookie to check.
	 * @returns {boolean} True if the cookie exists, otherwise false.
	 */
	cookieExists(name) {
		return this.getCookie(name) !== null;
	}
}

export { CookieManager };
