<script>
	import { goto } from '$app/navigation';
	import { AuthentificationManager } from '$lib/apiConnection';
	import Navigation from './../../lib/global/Navigation.svelte';
	import { CookieManager } from '$lib/cookieManager';
	import { writable } from 'svelte/store';
	import { StorageHandler } from '$lib/storageHandler';
	import { onMount } from 'svelte';

	const speed = writable(0);
	const price = writable(0);
	const distance = writable(0);
	const maxDistance = writable(10);
	const maxPrice = writable(100);
	const cars = writable([]);

	onMount(async () => {
		speed.set(
			(
				(await new StorageHandler(new AuthentificationManager().isAuthentificated()).get(
					'priority.speed'
				)) || { val: 0.7 }
			).val
		);
		price.set(
			(
				(await new StorageHandler(new AuthentificationManager().isAuthentificated()).get(
					'priority.price'
				)) || { val: 0.4 }
			).val
		);
		distance.set(
			(
				(await new StorageHandler(new AuthentificationManager().isAuthentificated()).get(
					'priority.distance'
				)) || { val: 0.6 }
			).val
		);

		maxDistance.set(
			(
				(await new StorageHandler(new AuthentificationManager().isAuthentificated()).get(
					'maxdistance'
				)) || { val: 10 }
			).val
		);
		maxPrice.set(
			(
				(await new StorageHandler(new AuthentificationManager().isAuthentificated()).get(
					'maxprice'
				)) || { val: 100 }
			).val
		);

		cars.set(
			(
				(await new StorageHandler(new AuthentificationManager().isAuthentificated()).get(
					'cars'
				)) || { val: [] }
			).val
		);

		speed.subscribe((val) =>
			new StorageHandler(new AuthentificationManager().isAuthentificated()).set('priority.speed', {
				val
			})
		);
		price.subscribe((val) =>
			new StorageHandler(new AuthentificationManager().isAuthentificated()).set('priority.price', {
				val
			})
		);
		distance.subscribe((val) =>
			new StorageHandler(new AuthentificationManager().isAuthentificated()).set(
				'priority.distance',
				{
					val
				}
			)
		);

		maxDistance.subscribe((val) =>
			new StorageHandler(new AuthentificationManager().isAuthentificated()).set('maxdistance', {
				val
			})
		);

		cars.subscribe((val) =>
			new StorageHandler(new AuthentificationManager().isAuthentificated()).set('cars', {
				val
			})
		);
	});
</script>

<Navigation></Navigation>

<div class="container">
	<h1>Settings</h1>

	<h2>Your cars</h2>
	<button class="add" on:click={() => goto('/addcar')}>
		<i class="bx bxs-plus-circle"></i>
	</button>
	<div class="cars">
		{#each $cars as car}
			<div class="car">
				<i class="bx bxs-car"></i>
				<p>{car.name}</p>
				<div class="actions">
					<button
						on:click={() => {
							let val = $cars;
							val = val.slice(val.indexOf(car), 1);
							cars.set(val);
						}}><i class="bx bx-trash"></i></button
					>
					<!--<button on:click={() => goto('/editcarinfo')}><i class="bx bx-cog"></i></button>-->
				</div>
			</div>
		{/each}
	</div>

	<h2>Prioritization</h2>
	<div class="line">
		<p>Speed</p>
		<input type="range" min="0" max="1" step="0.01" bind:value={$speed} />
	</div>

	<div class="line">
		<p>Price</p>
		<input type="range" min="0" max="1" step="0.01" bind:value={$price} />
	</div>

	<div class="line">
		<p>Distance</p>
		<input type="range" min="0" max="1" step="0.01" bind:value={$distance} />
	</div>

	<div class="line">
		<p>Max Price (€)</p>
		<input type="number" bind:value={$maxPrice} />
	</div>

	<div class="line">
		<p>Max Distance (km)</p>
		<input type="number" bind:value={$maxDistance} />
	</div>
	<h2>Sync settings</h2>
	<div class="line">
		{#if new AuthentificationManager().isAuthentificated()}
			<button class="accountb">Logout</button>
		{:else}
			<button class="accountb" on:click={() => goto('/login')}>Login</button>
			<button class="accountb" on:click={() => goto('/register')}>Registration</button>
		{/if}
	</div>
</div>

<style>
	.accountb {
		background-color: var(--accent);
		border: none;
		border-top-left-radius: 40px;
		border-bottom-left-radius: 40px;
		border-top-right-radius: 40px;
		border-bottom-right-radius: 40px;
		color: var(--text);
		width: 10%;
		min-width: 120px;
		height: 40px;
		font-size: 20px;
		cursor: pointer;
		margin-left: 10px;
		margin-right: 10px;
	}
	button:hover {
		background-color: var(--accent-400);
	}
	.line {
		display: flex;
	}

	.line > input[type='number'] {
		background-color: var(--background-100);
		border: none;
		outline: none;
		border-radius: 10px;
		padding: 6px;
		color: var(--text);
		margin: 4px;
		margin-left: auto;
	}

	.line > input[type='range'] {
		width: -webkit-fill-available;
		max-width: 80%;
		margin-left: auto;
		cursor: pointer;
	}

	.add {
		position: absolute;
		right: 20px;
		top: 50px;
		background-color: transparent;
		border: none;
		outline: none;
		color: var(--accent);
		font-size: 1.8em;
		transition: color 0.2s;
		cursor: pointer;
	}

	h2 {
		margin-bottom: 20px;
	}

	.add:hover {
		color: var(--accent-400);
	}

	.container {
		width: 40%;
		min-width: 300px;
		margin: 20px auto;
		position: relative;
	}

	.container h1 {
		text-align: center;
	}

	.container h2 {
		color: var(--text-800);
		font-weight: 400;
	}

	.container .cars .car {
		display: flex;
		background-color: var(--background-100);
		width: calc(80% - 20px);
		margin: auto;
		justify-content: space-between;
		padding: 20px;
		border-radius: 10px;
	}

	.container .cars .car > i {
		font-size: 1.8em;
		color: var(--text-600);
	}

	.container .actions {
		display: flex;
		gap: 10px;
	}

	.container .actions button {
		background-color: transparent;
		border: none;
		outline: none;
		color: var(--accent);
		font-size: 1.4em;
		transition: color 0.2s;
		cursor: pointer;
	}

	.container .actions button:hover {
		color: var(--accent-400);
	}
</style>
