<script>
	import { AuthentificationManager } from '$lib/apiConnection';
	import { writable } from 'svelte/store';
	import Navigation from './../../lib/global/Navigation.svelte';
	import { runError } from '$lib/global/Toasts.svelte';
	import { goto } from '$app/navigation';

	const email = writable('');
	const password = writable('');
	const password_repeat = writable('');
</script>

<Navigation></Navigation>
<div class="container">
	<h1>Register</h1>
	<div class="flex">
		<i class="bx bx-envelope"></i>
		<h4>E-Mail:</h4>
		<input
			type="text"
			name="e-mail"
			class="inputtext"
			placeholder="email@example.com"
			bind:value={$email}
		/>
	</div>
	<div class="flex">
		<i class="bx bxs-key"></i>
		<h4>Password:</h4>
		<input
			type="password"
			name="e-mail"
			class="inputtext"
			placeholder="Password"
			bind:value={$password}
		/>
	</div>
	<div class="flex">
		<i class="bx bxs-key"></i>
		<h4>Repeat Password:</h4>
		<input
			type="password"
			name="e-mail"
			class="inputtext"
			placeholder="Repeat Password"
			bind:value={$password_repeat}
		/>
	</div>
	<button
		on:click={async () => {
			if ($password != $password_repeat)
				return runError('The two passwords are not the same', 'Passwords do not match');
			if (await new AuthentificationManager().register($email, $password))
				if (await new AuthentificationManager().authentificate($email, $password)) goto('/');
		}}>Register</button
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
	.container {
		position: absolute;
		transform: translate(-50%, -50%);
		top: 35%;
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
		text-align: center;
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
			top: 40%;
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
