<script>
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let mobile = false;
	onMount(() => {
		mobile = window.innerWidth <= 800;
		window.addEventListener('resize', () => (mobile = window.innerWidth <= 800));
	});
</script>

<div class="navigation disable-selection" class:mobile>
	<img src="/img/logo_192.png" alt="Logo" on:click={() => goto('/')} />
	<div class="links">
		<a href="/">
			<i class="bx bx-search"></i>
			<p>Search</p>
		</a>
		<a href="/settings">
			<i class="bx bx-cog"></i>
			<p>Settings</p>
		</a>
	</div>
</div>

<style>
	.navigation {
		background-color: color-mix(in srgb, var(--background-100) 40%, transparent);
		backdrop-filter: blur(6px);
		border-right: 1px solid var(--background-100);
		position: fixed;
		left: 0px;
		width: 160px;
		height: calc(100vh - 40px);
		top: 0px;
		padding: 20px;
		border-top-right-radius: 8px;
		border-bottom-right-radius: 8px;
		overflow: hidden;
		z-index: 200;
	}

	.navigation > img {
		width: 100%;
		padding-bottom: 20px;
		cursor: pointer;
	}

	.navigation .links {
		display: flex;
		gap: 10px;
		flex-direction: column;
	}

	.navigation .links a {
		background-color: color-mix(in srgb, var(--background-200) 40%, transparent);
		backdrop-filter: blur(6px);
		color: var(--text-800);
		text-decoration: none;
		width: 100%;
		height: 40px;
		border-radius: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		transition: background-color 0.2s;
	}

	.navigation .links a:hover,
	.navigation .links a:focus {
		background-color: color-mix(in srgb, var(--background-200) 80%, transparent);
	}

	.navigation .links a i {
		font-size: 1.4em;
	}

	.navigation.mobile {
		width: 100%;
		height: 60px;
		padding: 8px;
		bottom: 0px;
		left: 0px;
		top: unset;
		border-right: none;
		border-top: 1px solid var(--background-100);
		display: flex;
		justify-content: center;
	}

	.navigation.mobile > img {
		display: none;
	}

	.navigation.mobile .links {
		flex-direction: row;
		gap: 20px;
		width: fit-content;
		overflow-y: auto;
	}

	.navigation.mobile .links a {
		width: auto;
		padding: 10px 10px;
		flex-direction: column;
		background-color: transparent;
		backdrop-filter: none;
		flex-shrink: 0;
	}

	.navigation.mobile .links a i {
		font-size: 1.8em;
	}

	.navigation.mobile .links a p {
		font-size: 0.75em;
		color: var(--text-600);
	}

	::-webkit-scrollbar {
		display: none;
	}
</style>
