<script>
	// @ts-nocheck

	import { AuthentificationManager } from '$lib/apiConnection';
	import { writable } from 'svelte/store';
	import Navigation from './../../lib/global/Navigation.svelte';
	import { runError } from '$lib/global/Toasts.svelte';
	import { goto } from '$app/navigation';
	import { StorageHandler } from '$lib/storageHandler';
	import { onMount } from 'svelte';

	const vname = writable('');
	const bcapacity = writable('');
	const bkwh = writable('');
	const vplug = writable('');
	const cars = writable([]);

	onMount(async () => {
		cars.set(
			(
				(await new StorageHandler(new AuthentificationManager().isAuthentificated()).get(
					'cars'
				)) || {
					val: []
				}
			).val
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
	<h1>Add Car</h1>
	<div class="flex">
		<i class="bx bxs-car"></i>
		<h4>Vehicle Name</h4>
		<input
			type="text"
			name="vname"
			class="inputtext"
			placeholder="Vehicle Namne"
			bind:value={$vname}
		/>
	</div>
	<div class="flex">
		<i class="bx bxs-car-battery"></i>
		<h4>Battery Capacity</h4>
		<input
			type="text"
			name="bcapacity"
			class="inputtext"
			placeholder="Capacity (kW/h)"
			bind:value={$bcapacity}
		/>
	</div>
	<div class="flex">
		<i class="bx bxs-battery-low"></i>
		<h4>Battery Consumption</h4>
		<input
			type="text"
			name="bkwh"
			class="inputtext"
			placeholder="Consumption (kWh/100km)"
			bind:value={$bkwh}
		/>
	</div>
	<div class="flex">
		<i class="bx bxs-plug"></i>
		<h4>Plug Type</h4>
		<div class="dropdown-wrapper carselect">
			<select bind:value={$vplug}>
				<option value="Type2Mennekes">Type 2 Mennekes</option>
				<option value="CCS">CCS</option>
				<option value="CHAdeMO">CHAdeMO</option>
			</select>
		</div>
	</div>

	<button
		on:click={() => {
			const val = $cars;
			val.push({
				name: $vname,
				kwh: $bkwh,
				capacity: $bcapacity,
				plug: $vplug
			});
			cars.set(val);
			goto('/settings');
		}}>Add Car</button
	>
</div>

<style>
	button {
		background-color: var(--accent);
		border: none;
		border-top-left-radius: 40px;
		border-bottom-left-radius: 40px;
		border-top-right-radius: 40px;
		border-bottom-right-radius: 40px;
		margin-top: 20px;
		color: black;
		width: 20%;
		min-width: 120px;
		height: 8vh;
		font-size: 20px;
		cursor: pointer;
	}
	button:hover {
		background-color: var(--accent-400);
	}
	.dropdown-wrapper {
		position: relative;
		display: inline-block;
		width: 200px;
		margin-top: 3.8%;
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
		top: 25%;
		right: 10px;
		transform: translateY(-50%);
		pointer-events: none;
		font-size: 12px;
		color: var(--text);
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
	.container {
		position: absolute;
		transform: translate(-50%, -50%);
		top: 28%;
		left: 55%;
		text-align: center;
		width: 40%;
		min-width: 120px;
		height: 20%;
		min-height: 50px;
	}
	.flex {
		display: flex;
		gap: 10px;
		padding-top: 20px;
	}
	.flex * {
		flex: none;
	}
	.flex i {
		background-color: var(--accent);
		padding: 5%;
		width: 3%;
		height: 5%;
		font-size: 25px;
		border-top-left-radius: 40px;
		border-bottom-left-radius: 40px;
	}
	.flex h4 {
		text-align: left;
		padding-top: 5%;
		width: 25%;
	}
	.flex input {
		width: calc(60% - 40px);
		background-color: var(--background-100);
		border-top-right-radius: 40px;
		border-bottom-right-radius: 40px;
		border: none;
		padding: 0px 15px;
		color: var(--text);
	}

	@media only screen and (max-width: 800px) and (min-width: 0px) {
		.container {
			position: absolute;
			transform: translate(-50%, -50%);
			top: 34%;
			left: 50%;
			text-align: center;
			width: 50%;
			min-width: 300px;
			height: 30%;
			min-height: 50px;
		}
		.flex {
			display: flex;
			gap: 20px;
			padding-top: 20px;
		}
		.flex * {
			flex: none;
		}
		.flex i {
			background-color: var(--primary-500);
			padding: 5%;
			margin-left: 5%;
			width: 7%;
			height: 20%;
			border-top-left-radius: 40px;
			border-bottom-left-radius: 40px;
		}
		.flex h4 {
			display: none;
		}
		.flex input {
			width: calc(60% - 40px);
			background-color: var(--background-100);
			border-top-right-radius: 40px;
			border-bottom-right-radius: 40px;
			border: none;
			padding: 0px 15px;
			color: var(--text);
			width: 60%;
		}
	}
</style>
