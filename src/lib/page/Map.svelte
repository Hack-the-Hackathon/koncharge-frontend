<script>
	import { onMount, onDestroy } from 'svelte';
	import { Map, Marker } from 'mapbox-gl';
	import 'mapbox-gl/dist/mapbox-gl.css';

	/**
	 * @type {HTMLDivElement}
	 */
	let mapContainer;
	/**
	 * @type {Map}
	 */
	let map;

	export let mapDataPoints;

	/**
	 * @type Array<Marker>
	 */
	let mapMarkers = [];

	export let userDestionation;

	onMount(() => {
		map = new Map({
			// @ts-ignore
			container: mapContainer,
			accessToken:
				'pk.eyJ1IjoiYXNkaWphc29kaGFzaHVkIiwiYSI6ImNsemQ1enkzZTBkaHkyaXM5aDkwbnF1dWwifQ.GWGbKzYFkQHqH3wkxeGumQ',
			style: `mapbox://styles/mapbox/${window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'}-v11`,
			center: [11.424796, 46.548325],
			zoom: 9
		});

		window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
			map.setStyle(
				`mapbox://styles/mapbox/${window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'}-v11`
			);
		});

		mapDataPoints.subscribe((/** @type {any[]} */ val) => {
			mapMarkers.forEach((marker) => marker.remove());
			mapMarkers = [];
			val.forEach((value) => {
				const marker = new Marker({
					color: val[0] !== value ? 'red' : 'green'
				});
				marker.setLngLat([value.scoordinate.x, value.scoordinate.y]).addTo(map);
				mapMarkers.push(marker);
			});
		});

		const marker = new Marker();
		userDestionation.subscribe((/** @type {{ longitude: number; latitude: number; }} */ value) =>
			marker.setLngLat([value.longitude, value.latitude])
		);
		marker.addTo(map);
	});

	onDestroy(() => {
		// @ts-ignore
		map.remove();
	});
</script>

<div class="map" bind:this={mapContainer}></div>

<style>
	.map {
		height: 100%;
	}
</style>
