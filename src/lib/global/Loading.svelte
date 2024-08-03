<script>
	import { Diamonds } from 'svelte-loading-spinners';
	import { fade } from 'svelte/transition';
</script>

<div class="page-loading" out:fade={{ duration: 250 }}>
	<Diamonds size="120" color="#7ce024" unit="px" duration="1.3s" />
</div>

<style>
	.page-loading {
		display: flex;
		width: 100%;
		height: 100%;
		z-index: 999;
		position: fixed;
		top: 0px;
		left: 0px;
		right: 0px;
		bottom: 0px;
		background-color: var(--background);
		justify-content: center;
		align-items: center;
	}
</style>
