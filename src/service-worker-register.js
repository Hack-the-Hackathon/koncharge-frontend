if ('serviceWorker' in navigator) {
	navigator.serviceWorker
		.register('/service-worker.js')
		.then(function (registration) {
			console.log('Service Worker registered with scope:', registration.scope);

			registration.onupdatefound = function () {
				const installingWorker = registration.installing;
				if (!installingWorker) return;

				installingWorker.onstatechange = function () {
					if (installingWorker.state === 'installed') {
						if (navigator.serviceWorker.controller) {
							console.log('New or updated content is available.');
						} else {
							console.log('Content is now available offline!');
						}
					}
				};
			};
		})
		.catch(function (error) {
			console.log('Service Worker registration failed:', error);
		});
}
