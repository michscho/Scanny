declare module "dom-focus-lock" {
	interface FocusLock {
		on(element: HTMLElement): void;
		off(element: HTMLElement): void;
	}

	const focusLock: FocusLock;
	export default focusLock;
}
