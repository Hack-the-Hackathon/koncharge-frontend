<script>
	import Loading from './../lib/global/Loading.svelte';
	import Map from './../lib/page/Map.svelte';
	import Navigation from './../lib/global/Navigation.svelte';
	import { writable } from 'svelte/store';
	import { onMount } from 'svelte';
	import { API_BASE } from '$lib/apiConnection';
	import { runError } from '$lib/global/Toasts.svelte';
	import { StorageHandler } from '$lib/storageHandler';
	import { AuthentificationManager } from '$lib/apiConnection';

	const currentSuggestions = writable([]);

	const userDestionation = writable({ longitude: 0, latitude: 0 });

	const foundRoutes = writable([]);

	const destinationInput = writable('');
	const changingLevelSlider = writable(50);
	const goalLevelSlider = writable(100);
	const requiredTime = writable(60);

	const loading = writable(false);

	const cars = writable([]);
	const selectedCar = writable('');
	const speed = writable(0);
	const price = writable(0);
	const distance = writable(0);
	const maxDistance = writable(10);
	const maxPrice = writable(100);

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
	});
</script>

<Navigation></Navigation>
{#if $loading}
	<Loading></Loading>
{/if}
<div class="mapContaiter">
	<Map {userDestionation} mapDataPoints={foundRoutes}></Map>
</div>
<div class="routePlanner">
	<div class="destinationInput">
		<input
			type="text"
			placeholder="Destination"
			bind:value={$destinationInput}
			on:change={async () => {
				currentSuggestions.set(
					(
						await (
							await fetch(`${API_BASE}/Mapbox/GetAutocompletion?text=${$destinationInput}`, {
								method: 'GET',
								headers: {
									'Content-Type': 'application/json'
								}
							})
						).json()
					).suggestions
				);
			}}
		/>
		{#if navigator.geolocation}
			<button
				on:click={async () => {
					const pos = await new Promise((resolve, reject) =>
						navigator.geolocation.getCurrentPosition(
							(e) => resolve(e),
							() => reject()
						)
					);
					userDestionation.set({ longitude: pos.coords.longitude, latitude: pos.coords.latitude });
				}}
			>
				<i class="bx bx-current-location"></i>
			</button>
		{/if}
		<div class="suggestions">
			{#each $currentSuggestions as suggestion}
				<button
					class="suggestion"
					on:click={async () => {
						const data = await (
							await fetch(`${API_BASE}/Mapbox/GetCoordinates?mapbox_id=${suggestion.mapbox_id}`, {
								method: 'GET',
								headers: {
									'Content-Type': 'application/json'
								}
							})
						).json();
						userDestionation.set({ longitude: data.longitude, latitude: data.latitude });
						currentSuggestions.set([]);
					}}
				>
					<p><i class="bx bx-been-here"></i>{suggestion.name}</p>
				</button>
			{/each}
		</div>
	</div>
	<div class="levelSlider">
		<p>Battery level:</p>
		<input type="number" bind:value={$changingLevelSlider} />
		<input type="range" bind:value={$changingLevelSlider} />
	</div>
	<div class="levelSlider">
		<p>Level goal:</p>
		<input type="number" bind:value={$goalLevelSlider} />
		<input type="range" bind:value={$goalLevelSlider} />
	</div>

	<div class="bottom-layer">
		<div class="requiredTime">
			<input type="number" bind:value={$requiredTime} />
			<p>min</p>
		</div>
		<div class="dropdown-wrapper carselect">
			<select bind:value={$selectedCar}>
				{#each $cars as car}
					<option value={car.name}>{car.name}</option>
				{/each}
			</select>
		</div>
		<button
			class="go"
			on:click={async () => {
				if ($userDestionation.longitude === 0 && $userDestionation.latitude === 0)
					return runError('Please select a location first', 'Select location');
				loading.set(true);

				const car = $cars.filter((val) => val.name == $selectedCar);

				const data = await (
					await fetch(
						`${API_BASE}/ChargePoints/Load?lat=${$userDestionation.latitude}&lng=${$userDestionation.longitude}&duration=${$requiredTime}&selectionConfig=${JSON.stringify(
							{
								outletType: car[0].plug,
								maxCapacity: car[0].capacity,
								currentPercentage: $changingLevelSlider / 100,
								targetPercentage: $goalLevelSlider / 100,
								maxPrice: $maxPrice,
								maxDistance: $maxDistance,
								priorities: [
									{
										priorityName: 'distance',
										priority: $distance
									},
									{
										priorityName: 'price',
										priority: $price
									},
									{
										priorityName: 'speed',
										priority: $speed
									}
								]
							}
						)}`,
						{
							method: 'GET',
							headers: {
								'Content-Type': 'application/json'
							}
						}
					)
				).json();

				let routes = data.data;
				/*routes.sort(
					(
						/** @type {{ route: { routeTime: number; }; }} */ //a,
				/** @type {{ route: { routeTime: number; }; }} */ // b;
				/*) => a.route.routeTime - b.route.routeTime
				);*/

				foundRoutes.set(routes);
				loading.set(false);
			}}
		>
			<i class="bx bxs-chevrons-right"></i>
		</button>
	</div>
</div>

<style>
	.bottom-layer {
		display: flex;
		justify-content: space-around;
	}

	.requiredTime {
		display: flex;
		align-items: center;
		margin-left: 10px;
	}

	.requiredTime input {
		background-color: transparent;
		color: var(--text);
		border: none;
		width: 40px;
	}

	.go {
		background-color: var(--background-200);
		border: none;
		width: 50px;
		height: 40px;
		border-radius: 10px;
		color: white;
		font-size: 1.3em;
		flex-shrink: 0;
		cursor: pointer;
	}

	.dropdown-wrapper {
		position: relative;
		display: inline-block;
		width: 200px;
	}

	.dropdown-wrapper select {
		width: 100%;
		padding: 10px;
		font-size: 16px;
		border: 1px solid var(--background-100);
		border-radius: 4px;
		background-color: var(--background-200);
		appearance: none;
		-webkit-appearance: none;
		-moz-appearance: none;
		color: var(--text);
	}

	.dropdown-wrapper::after {
		content: '\25BC'; /* Unicode character for down arrow */
		position: absolute;
		bottom: 50%;
		right: 10px;
		transform: translateY(-50%);
		pointer-events: none;
		font-size: 12px;
		color: var(--text);
		rotate: 180deg;
	}

	.dropdown-wrapper option {
		padding: 10px;
		background-color: var(--background-200);
		color: var(--text);
	}

	.dropdown-wrapper select:focus {
		border-color: var(--background-300);
		outline: none;
		box-shadow: 0 0 5px color-mix(in srgb, var(--background-300) 60%, transparent);
	}

	.dropdown-wrapper select:hover {
		border-color: #888;
	}

	.levelSlider {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 90%;
		max-width: 400px;
		margin: 12px auto;
	}

	.levelSlider > input[type='number'] {
		width: 50px;
		background-color: transparent;
		border: none;
		outline: none;
		color: var(--text-800);
		margin-left: auto;
	}

	.levelSlider > input[type='range'] {
		width: -webkit-fill-available;
		max-width: 40%;
		cursor: pointer;
	}

	.levelSlider > p {
		color: var(--text-600);
		font-weight: 500;
	}

	.suggestions {
		left: 50%;
		transform: translateX(-50%);
		position: absolute;
		top: 46px;
		display: flex;
		flex-direction: column;
		width: calc(100% - 60px);
		justify-content: center;
		background-color: color-mix(in srgb, var(--background-200), var(--background-100));
		max-height: 100px;
		overflow-y: scroll;
		border-bottom-left-radius: 10px;
		border-bottom-right-radius: 10px;
	}

	.suggestions::-webkit-scrollbar {
		display: none;
	}

	.suggestions .suggestion {
		outline: none;
		border: none;
		background-color: transparent;
		border-bottom: 1px solid var(--background-300);
		padding-bottom: 4px;
		padding-top: 4px;
		color: var(--text);
		height: 80px;
		cursor: pointer;
		transition: background-color 0.2s;
		text-align: left;
	}

	.suggestions .suggestion p {
		display: flex;
		align-items: center;
	}

	.suggestions .suggestion p i {
		font-size: 1.4em;
		margin: 0px 6px;
	}

	.suggestions .suggestion:hover {
		background-color: color-mix(in srgb, transparent 70%, var(--background-200));
	}

	.suggestions .suggestion:first-child {
		padding-top: 0px;
	}

	.suggestions .suggestion:last-child {
		margin-bottom: 0px;
		border-bottom: none;
		border-bottom-left-radius: 10px;
		border-bottom-right-radius: 10px;
	}

	.destinationInput {
		position: relative;
		height: 45px;
	}

	.destinationInput > * {
		position: absolute;
	}

	.destinationInput > input {
		width: calc(100% - 16px);
		padding: 8px;
		height: calc(100% - 16px);
		background-color: var(--background-200);
		color: var(--text);
		outline: none;
		border: none;
		border-radius: 20px;
	}

	.destinationInput > input::placeholder {
		color: var(--text-800);
	}

	.destinationInput > button {
		right: 6px;
		font-size: 2em;
		background-color: var(--accent);
		border: none;
		border-radius: 50%;
		color: var(--background-100);
		display: flex;
		top: 50%;
		transform: translateY(-50%);
		cursor: pointer;
	}

	.destinationInput > button:hover {
		background-color: var(--accent-700);
	}

	.mapContaiter,
	.mapContainer > * {
		height: 100vh;
		position: fixed;
		top: 0px;
		bottom: 0px;
		width: 100vw;
	}

	.routePlanner {
		width: 40%;
		min-width: 300px;
		background-color: color-mix(in srgb, var(--background-100) 40%, transparent);
		backdrop-filter: blur(6px);
		border-top: 1px solid var(--background-100);
		border-left: 1px solid var(--background-100);
		border-right: 1px solid var(--background-100);
		border-top-left-radius: 20px;
		border-top-right-radius: 20px;
		height: 165px;
		position: fixed;
		bottom: 0px;
		left: 50%;
		transform: translateX(-50%);
		overflow-y: auto;
		padding: 10px;
	}

	.routePlanner::-webkit-scrollbar {
		display: none;
	}

	@media (max-width: 500px) {
		.routePlanner {
			width: calc(100% - 40px);
		}
	}

	@media (max-width: 800px) {
		.routePlanner {
			margin-bottom: 76px;
		}
	}
</style>
