<script>
	import Loading from './../lib/global/Loading.svelte';
	import { navigateAndPrefetch } from '$lib/prefetch';

	import { navigating } from '$app/stores';
	import { afterUpdate, beforeUpdate, onMount } from 'svelte';
	import { get, writable } from 'svelte/store';
	import '../service-worker-register.js';

	import Toasts from '$lib/global/Toasts.svelte';

	let isLoading = true;
	onMount(() => (document.title = 'KonCharge'));

	/**
	 * @type {number | null}
	 */
	let loadingTimeout = null;
	beforeUpdate(() => {
		if (get(navigating)) isLoading = true;
	});

	afterUpdate(async () => {
		if (!isLoading || loadingTimeout) return;

		loadingTimeout = setTimeout(() => {
			isLoading = false;
			loadingTimeout = null;
		}, 500);
	});
</script>

<main use:navigateAndPrefetch>
	<Toasts></Toasts>
	{#if $navigating || isLoading}
		<Loading></Loading>
	{/if}
	<slot></slot>
</main>
