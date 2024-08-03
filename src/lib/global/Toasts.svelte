<script context="module">
	import { fly } from 'svelte/transition';
	import { writable } from 'svelte/store';

	/**
	 * @typedef Error
	 * @property {string} description The description of the error
	 * @property {string} title The title of the error
	 */
	/**
	 * @type import("svelte/store").Writable<Array<Error>>
	 */
	// @ts-ignore
	const errors = writable([]);

	/**
	 * @typedef Info
	 * @property {string} description The description of the info
	 * @property {string} title The title of the info
	 */
	/**
	 * @type import("svelte/store").Writable<Array<Info>>
	 */
	// @ts-ignore
	const infos = writable([]);

	/**
	 * @typedef Success
	 * @property {string} description The description of the success message
	 * @property {string} title The title of the success message
	 */
	/**
	 * @type import("svelte/store").Writable<Array<Success>>
	 */
	// @ts-ignore
	const successes = writable([]);

	/**
	 * Displays an error to the user
	 * @param {string} description The description of the error
	 * @param {string} title The title of the error
	 */
	export function runError(description, title = 'Error') {
		console.error(title, description);
		/**
		 * @type Error
		 */
		const error = {
			description,
			title
		};
		errors.update((/** @type {Error[]} */ n) => {
			n.push(error);
			return n;
		});
		// @ts-ignore
		setTimeout(() => {
			errors.update((/** @type {Error[]} */ n) => {
				n.splice(n.indexOf(error), 1);
				return n;
			});
		}, 5000);
	}

	/**
	 * Displays a info message to the user
	 * @param {string} description The description of the info message
	 * @param {string} title The title of the info message
	 */
	export function showInfo(description, title) {
		/**
		 * @type Info
		 */
		const info = {
			description,
			title
		};
		infos.update((/** @type {Info[]} */ n) => {
			n.push(info);
			return n;
		});
		// @ts-ignore
		setTimeout(() => {
			infos.update((/** @type {Info[]} */ n) => {
				n.splice(n.indexOf(info), 1);
				return n;
			});
		}, 5000);
	}

	/**
	 * Displays a success message to the user
	 * @param {string} description The description of the success message
	 * @param {string} title The title of the success message
	 */
	export function showSuccess(description, title) {
		/**
		 * @type Success
		 */
		const success = {
			description,
			title
		};
		successes.update((/** @type {Success[]} */ n) => {
			n.push(success);
			return n;
		});
		// @ts-ignore
		setTimeout(() => {
			successes.update((/** @type {Success[]} */ n) => {
				n.splice(n.indexOf(success), 1);
				return n;
			});
		}, 5000);
	}

	let errorTitle = writable('');
	let errorDescription = writable('');
	let criticalError = writable(false);
</script>

<script>
	/**
	 * @param {Error} error
	 */
	function removeError(error) {
		errors.update((/** @type {any[]} */ n) => {
			n.splice(n.indexOf(error), 1);
			return n;
		});
	}

	/**
	 * @param {Info} info
	 */
	function removeInfo(info) {
		infos.update((/** @type {any[]} */ n) => {
			n.splice(n.indexOf(info), 1);
			return n;
		});
	}

	/**
	 * @param {Success} success
	 */
	function removeSuccess(success) {
		successes.update((/** @type {any[]} */ n) => {
			n.splice(n.indexOf(success), 1);
			return n;
		});
	}
</script>

{#each $errors as error (error)}
	<div transition:fly={{ x: 200 }} class="toast">
		<i class="bx bx-error"></i>
		<div class="right">
			<h4>{error.title}</h4>
			<p>{error.description}</p>
		</div>
		<button on:click={() => removeError(error)}><i class="bx bx-x"></i></button>
	</div>
{/each}

{#each $infos as info (info)}
	<div transition:fly={{ x: 200 }} class="toast info">
		<i class="bx bx-info-circle"></i>
		<div class="right">
			<h4>{info.title}</h4>
			<p>{info.description}</p>
		</div>
		<button on:click={() => removeInfo(info)}><i class="bx bx-x"></i></button>
	</div>
{/each}

{#each $successes as success (success)}
	<div transition:fly={{ x: 200 }} class="toast success">
		<i class="bx bx-check-circle"></i>
		<div class="right">
			<h4>{success.title}</h4>
			<p>{success.description}</p>
		</div>
		<button on:click={() => removeSuccess(success)}><i class="bx bx-x"></i></button>
	</div>
{/each}

<style>
	.toast {
		position: fixed;
		z-index: 200;
		right: 10px;
		top: 10px;
		width: 275px;
		height: 75px;
		background-color: var(--background-100);
		border-radius: 20px;
		border: 1px solid var(--text-200);
		display: flex;
		align-items: center;
		justify-content: left;
		gap: 15px;
		padding: 10px;
	}

	.toast > i {
		font-size: 3em;
		color: #a20;
	}

	.toast.success > i {
		font-size: 3em;
		color: #0a6;
	}

	.toast.info > i {
		font-size: 3em;
		color: #ea0;
	}

	.toast h4 {
		font-weight: 600;
	}

	.toast p {
		color: var(--text-900);
	}

	.toast > button {
		color: var(--text-800);
		font-size: 1.5em;
		position: absolute;
		right: 20px;
		background-color: transparent;
		border: none;
		outline: none;
		cursor: pointer;
	}

	.criticalError {
		text-align: center;
		height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		position: fixed;
		left: 0px;
		top: 0px;
		bottom: 0px;
		right: 0px;
		z-index: 999;
		background-color: var(--background);
	}

	.criticalError h1 {
		font-weight: 100;
		font-size: 2em;
		margin-bottom: 20px;
		color: var(--text-800);
	}

	.criticalError h2 {
		font-size: 4em;
		font-weight: 500;
		line-height: 50px;
	}

	.criticalError h3 {
		font-weight: 200;
		color: var(--text-900);
	}

	.criticalError p {
		margin-top: 10vh;
		color: var(--text-800);
	}

	.criticalError a {
		background-color: var(--accent);
		width: fit-content;
		padding: 8px 12px;
		margin: 15px;
		border-radius: 10px;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.criticalError a:hover {
		background-color: var(--accent-400);
	}
</style>
