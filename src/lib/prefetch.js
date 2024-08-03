/**
 *
 * @param {*} node
 */
export function navigateAndPrefetch(node) {
	if (node.tagName === 'A' && node.href && node.origin === window.location.origin) {
		node.setAttribute('sveltekit:navigation', '');
		node.setAttribute('sveltekit:prefetch', '');
	}
}
