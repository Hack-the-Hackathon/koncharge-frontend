import { CookieManager } from './cookieManager';
import { runError, showSuccess } from './global/Toasts.svelte';

const cookieManager = new CookieManager();

const API_BASE = 'http://localhost:5249'; //TODO: Change this

class AuthentificationManager {
	constructor() {}

	/**
	 * @returns {boolean} If the user is authentificated
	 */
	isAuthentificated() {
		return cookieManager.cookieExists('auth');
	}

	/**
	 *
	 * @returns {string | null} The auth token of the user
	 */
	getAuthToken() {
		return cookieManager.getCookie('auth');
	}

	/**
	 * Logs the user in
	 * @param {string} email - The email of the user
	 * @param {string} password - The password of the user
	 * @returns {Promise<boolean>} If the login was successful
	 */
	async authentificate(email, password) {
		if (!email || !password) {
			runError('Email or Password is invalid... Please enter something.', 'Invalid input');
			return false;
		}
		const result = await fetch(`${API_BASE}/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				email: email,
				password: password
			})
		});

		if (!result.ok) {
			runError('The credentials entered seem to be invalid', 'Invalid credentials');
			return false;
		}

		const data = await result.json();
		cookieManager.setCookie('auth', data.accessToken);
		cookieManager.setCookie('refresh', data.refreshToken);

		showSuccess('Your login was successful', 'Login successful');
		return true;
	}

	/**
	 * Creates a new account for the user
	 * @param {string} email - The email of the user
	 * @param {string} password - The password of the user
	 * @returns {Promise<boolean>} If the account creation was successful
	 */
	async register(email, password) {
		if (!email || !password) {
			runError('Email or Password is invalid... Please enter something.', 'Invalid input');
			return false;
		}
		const result = await fetch(`${API_BASE}/register`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				email: email,
				password: password
			})
		});

		if (!result.ok) {
			runError('The credentials entered seem to be invalid', 'Invalid credentials');
			return false;
		}

		showSuccess('Your account is created', 'Creation successful');
		return true;
	}
}

export { API_BASE, AuthentificationManager };
