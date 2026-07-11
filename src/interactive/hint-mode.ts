import { ElementsActionRecord } from "./elements-actions";
import { isVisibleAndEnabled } from "./search-element";
import { clickHTMLElement } from "./click-element";

const HINT_CONTAINER_ID = "scanny-hint-container";

/**
 * Home-row-friendly alphabet (same idea as Vimium's). All labels are generated
 * with the same length, so no label is a prefix of another.
 */
const HINT_ALPHABET = "sadfjklewcmpgh";

interface Hint {
	label: string;
	el: HTMLElement;
	marker: HTMLElement;
}

let hints: Hint[] = [];
let typed = "";
let active = false;
let openInNewTab = false;

function isPaletteOpen(): boolean {
	return document.getElementById("scanny-extension-root") !== null;
}

function isEditable(el: Element | null): boolean {
	if (!el) return false;
	const tag = el.tagName;
	if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
	if ((el as HTMLElement).isContentEditable) return true;
	const role = el.getAttribute("role");
	return role === "textbox" || role === "searchbox" || role === "combobox";
}

function isInViewport(rect: DOMRect): boolean {
	return (
		rect.bottom > 0 &&
		rect.right > 0 &&
		rect.top < window.innerHeight &&
		rect.left < window.innerWidth
	);
}

/**
 * Collect every visible, viewport-intersecting clickable element: the standard
 * category selectors plus a bounded cursor:pointer scan.
 */
function collectHintTargets(): HTMLElement[] {
	const seen = new Set<HTMLElement>();
	const targets: HTMLElement[] = [];

	const combinedSelector = Object.values(ElementsActionRecord)
		.map((cat) => cat.selector)
		.join(", ");

	document.querySelectorAll<HTMLElement>(combinedSelector).forEach((el) => {
		if (seen.has(el)) return;
		if (el.closest(".scanny-extension")) return;
		if (!isInViewport(el.getBoundingClientRect())) return;
		if (!isVisibleAndEnabled(el)) return;
		seen.add(el);
		targets.push(el);
	});

	// cursor:pointer elements missed by the selectors (time-budgeted)
	const candidates = document.querySelectorAll<HTMLElement>(
		"div, span, li, img, svg, i, p, td, th, figure, article, section, nav, a:not([href])"
	);
	const startTime = performance.now();
	for (let i = 0; i < candidates.length; i++) {
		if (i % 100 === 0 && performance.now() - startTime > 80) break;
		const el = candidates[i];
		if (seen.has(el)) continue;
		if (el.closest(".scanny-extension")) continue;
		if (el.children.length > 12) continue;
		if (!isInViewport(el.getBoundingClientRect())) continue;
		if (!isVisibleAndEnabled(el)) continue;
		if (window.getComputedStyle(el).cursor !== "pointer") continue;
		// Skip if a hinted ancestor already covers this element
		if (el.parentElement?.closest("a, button, [role='button']")) continue;
		seen.add(el);
		targets.push(el);
	}

	return targets;
}

/**
 * Generate n distinct labels of uniform length from HINT_ALPHABET.
 */
function generateHintLabels(n: number): string[] {
	let length = 1;
	while (Math.pow(HINT_ALPHABET.length, length) < n) length++;

	const labels: string[] = [];
	for (let i = 0; i < n; i++) {
		let label = "";
		let rest = i;
		for (let pos = 0; pos < length; pos++) {
			label = HINT_ALPHABET[rest % HINT_ALPHABET.length] + label;
			rest = Math.floor(rest / HINT_ALPHABET.length);
		}
		labels.push(label);
	}
	return labels;
}

function renderMarker(label: string, rect: DOMRect): HTMLElement {
	const marker = document.createElement("div");
	marker.className = "scanny-hint";
	if (openInNewTab) marker.classList.add("scanny-hint-newtab");
	for (const char of label) {
		const span = document.createElement("span");
		span.textContent = char;
		marker.appendChild(span);
	}
	marker.style.left = `${Math.max(0, rect.left + window.scrollX - 2)}px`;
	marker.style.top = `${Math.max(0, rect.top + window.scrollY - 14)}px`;
	return marker;
}

function enterHintMode(newTab: boolean) {
	openInNewTab = newTab;
	const targets = collectHintTargets();
	if (targets.length === 0) return;

	const labels = generateHintLabels(targets.length);
	const container = document.createElement("div");
	container.id = HINT_CONTAINER_ID;
	container.className = "scanny-extension";

	hints = targets.map((el, i) => {
		const marker = renderMarker(labels[i], el.getBoundingClientRect());
		container.appendChild(marker);
		return { label: labels[i], el, marker };
	});

	document.documentElement.appendChild(container);
	typed = "";
	active = true;
	window.addEventListener("blur", exitHintMode);
}

function exitHintMode() {
	document.getElementById(HINT_CONTAINER_ID)?.remove();
	hints = [];
	typed = "";
	active = false;
	window.removeEventListener("blur", exitHintMode);
}

function activateHint(hint: Hint) {
	const el = hint.el;
	exitHintMode();
	const href = el.getAttribute("href");
	if (openInNewTab && el.tagName === "A" && href) {
		window.open(href, "_blank", "noopener");
		return;
	}
	clickHTMLElement(el);
}

/** Re-filter markers against the typed prefix; click on a full match. */
function updateHints() {
	const matching = hints.filter((h) => h.label.startsWith(typed));

	if (matching.length === 0) {
		exitHintMode();
		return;
	}

	const exact = matching.find((h) => h.label === typed);
	if (exact) {
		activateHint(exact);
		return;
	}

	for (const hint of hints) {
		const isMatch = hint.label.startsWith(typed);
		hint.marker.style.display = isMatch ? "" : "none";
		if (!isMatch) continue;
		hint.marker.querySelectorAll("span").forEach((span, i) => {
			span.classList.toggle("scanny-hint-typed", i < typed.length);
		});
	}
}

function onKeyDown(event: KeyboardEvent) {
	if (isPaletteOpen()) {
		if (active) exitHintMode();
		return;
	}

	if (active) {
		if (event.key === "Escape") {
			exitHintMode();
		} else if (event.key === "Backspace") {
			typed = typed.slice(0, -1);
			updateHints();
		} else if (event.key.length === 1 && HINT_ALPHABET.includes(event.key.toLowerCase())) {
			typed += event.key.toLowerCase();
			updateHints();
		} else if (event.key === "Shift") {
			return; // allow holding shift without leaving hint mode
		} else {
			exitHintMode();
			return; // let the page handle the key
		}
		event.preventDefault();
		event.stopImmediatePropagation();
		return;
	}

	// Trigger: plain `f` (or `F` for new tab) outside of any editable context
	if (
		(event.key === "f" || event.key === "F") &&
		!event.ctrlKey &&
		!event.metaKey &&
		!event.altKey &&
		!event.repeat &&
		!isEditable(event.target as Element) &&
		!isEditable(document.activeElement)
	) {
		enterHintMode(event.key === "F");
		if (active) {
			event.preventDefault();
			event.stopImmediatePropagation();
		}
	}
}

/**
 * Install the modeless hint-mode listener: press `f` on any page to show
 * Vimium-style link hints, type the label to click. `F` opens links in a
 * new tab, Escape cancels.
 */
export function initHintMode() {
	window.addEventListener("keydown", onKeyDown, true);
}
