import { API_BASE, AuthentificationManager } from './apiConnection';
import { browser } from '$app/environment';

const authentificationManager = new AuthentificationManager();

class StorageHandler {
	/**
	 * Handles the storing and retrieveing of data
	 * @param {boolean} authentificated If the user is logged in. If not the StorageHandler will save everything locally.
	 */
	constructor(authentificated) {
		/**
		 * @private
		 */
		this.authentificated = authentificated;
	}

	/**
	 * Gets a data previously set
	 * @param {string} key The key of the data to get
	 * @param {string | null} defaultValue A value that gets returned, when the data does not exist
	 * @returns
	 */
	async get(key, defaultValue = null) {
		if (this.authentificated) {
			const result = await fetch(`${API_BASE}/SettingsStorage/GetSetting?settingKey=${key}`, {
				headers: new Headers({
					Authorization: 'Bearer ' + authentificationManager.getAuthToken(),
					'Content-Type': 'application/json'
				}),
				method: 'GET'
			});

			if (!result.ok && !defaultValue)
				throw new StorageRequestException("The request to the storage coudn't be made!");
			if (!result.ok) return defaultValue;

			return await result.json();
		}

		if (browser) {
			const storedValue = localStorage.getItem(key);
			return storedValue ? JSON.parse(storedValue) : defaultValue;
		}

		if (!defaultValue)
			throw new StorageRequestException("The request to the storage coudn't be made!");
		return defaultValue;
	}

	/**
	 * Saves a value that can be read later or in another session
	 * @param {string} key The key of the data to save
	 * @param {Object} value The value of the data
	 */
	async set(key, value) {
		if (this.authentificated) {
			const result = await fetch(`${API_BASE}/SettingsStorage/SetSetting?settingKey=${key}`, {
				method: 'POST',
				headers: new Headers({
					Authorization: 'Bearer ' + authentificationManager.getAuthToken(),
					'Content-Type': 'application/json'
				}),
				body: `"${value}"`
			});

			if (!result.ok)
				throw new StorageRequestException("The request to the storage coudn't be made!");
			return;
		}

		if (browser) localStorage.setItem(key, JSON.stringify(value));
		//throw new StorageRequestException("The request to the storage coudn't be made!");
	}
}

class StorageRequestException extends Error {}

export { StorageHandler };
