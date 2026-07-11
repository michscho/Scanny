/**
 * Constant-speed, toggleable auto-scroll for reading long pages.
 *
 * Good-UX guarantees:
 * - Frame-rate independent speed (px per second) via timestamp deltas.
 * - Re-runnable: calling toggle while running stops it.
 * - Any manual interaction (wheel, touch, key, click) stops it instantly so
 *   the user always regains control.
 * - Re-reads the page height each frame, so it keeps going as content lazy-loads
 *   and stops cleanly once the real bottom is reached.
 * - A subtle, dismissible indicator shows it is active and how to stop.
 */

const DEFAULT_SPEED = 60; // px per second — slow, comfortable reading pace
const INDICATOR_ID = "scanny-autoscroll-indicator";

let rafId = 0;
let lastTs = 0;
let remainder = 0;
let running = false;
let speed = DEFAULT_SPEED;
let indicator: HTMLElement | null = null;

function maxScroll(): number {
	const doc = document.documentElement;
	const height = Math.max(
		document.body.scrollHeight,
		document.body.offsetHeight,
		doc.scrollHeight,
		doc.offsetHeight
	);
	return height - window.innerHeight;
}

function step(ts: number) {
	if (!running) {
		return;
	}
	if (!lastTs) {
		lastTs = ts;
	}
	const dt = (ts - lastTs) / 1000;
	lastTs = ts;

	remainder += speed * dt;
	const move = Math.floor(remainder);
	if (move > 0) {
		remainder -= move;
		window.scrollBy(0, move);
	}

	if (window.pageYOffset >= maxScroll() - 1) {
		stopAutoScroll();
		return;
	}
	rafId = requestAnimationFrame(step);
}

// Stop as soon as the user interacts, so auto-scroll never fights the user.
// `scroll` is intentionally NOT listened to — our own scrollBy would trigger it.
const stopOnUserInteraction = () => stopAutoScroll();
const interactionEvents = ["wheel", "touchstart", "keydown", "mousedown"] as const;

function addInteractionListeners() {
	window.addEventListener("wheel", stopOnUserInteraction, { passive: true });
	window.addEventListener("touchstart", stopOnUserInteraction, { passive: true });
	window.addEventListener("keydown", stopOnUserInteraction);
	window.addEventListener("mousedown", stopOnUserInteraction);
}

function removeInteractionListeners() {
	for (const type of interactionEvents) {
		window.removeEventListener(type, stopOnUserInteraction);
	}
}

function showIndicator() {
	if (indicator) {
		return;
	}
	const pill = document.createElement("div");
	pill.id = INDICATOR_ID;
	pill.textContent = "Auto-scrolling — press any key or click to stop";
	Object.assign(pill.style, {
		position: "fixed",
		bottom: "24px",
		left: "50%",
		transform: "translateX(-50%)",
		zIndex: "2147483647",
		padding: "9px 16px",
		borderRadius: "999px",
		background: "rgba(16, 21, 29, 0.92)",
		color: "#f4f7fb",
		font: '600 13px/1.2 "Inter", system-ui, sans-serif',
		boxShadow: "0 10px 30px rgba(0, 0, 0, 0.38)",
		backdropFilter: "blur(8px)",
		cursor: "pointer",
		userSelect: "none",
		pointerEvents: "auto",
	} as Partial<CSSStyleDeclaration>);
	pill.addEventListener("click", stopAutoScroll);
	document.body.appendChild(pill);
	indicator = pill;
}

function hideIndicator() {
	indicator?.remove();
	indicator = null;
}

export function stopAutoScroll() {
	if (!running) {
		return;
	}
	running = false;
	if (rafId) {
		cancelAnimationFrame(rafId);
	}
	rafId = 0;
	lastTs = 0;
	remainder = 0;
	removeInteractionListeners();
	hideIndicator();
}

function startAutoScroll(pxPerSecond: number) {
	speed = pxPerSecond > 0 ? pxPerSecond : DEFAULT_SPEED;
	if (maxScroll() <= 0) {
		return; // nothing to scroll
	}
	running = true;
	lastTs = 0;
	remainder = 0;
	showIndicator();
	addInteractionListeners();
	rafId = requestAnimationFrame(step);
}

/** Start auto-scrolling, or stop if it is already running. */
export function toggleAutoScroll(pxPerSecond: number = DEFAULT_SPEED) {
	if (running) {
		stopAutoScroll();
		return;
	}
	startAutoScroll(pxPerSecond);
}
