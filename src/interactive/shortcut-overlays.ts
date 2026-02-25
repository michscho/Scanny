import { Action } from "../actions/data/types-data";

const OVERLAY_CLASS = "scanny-shortcut-overlay";
const TARGET_ATTRIBUTE = "data-scanny-target-id";

/** Minimum pixel distance between overlay centers to avoid visual overlap. */
const MIN_DISTANCE = 32;

interface PlacedOverlay {
	x: number;
	y: number;
}

function overlaps(x: number, y: number, placed: PlacedOverlay[]): boolean {
	for (const p of placed) {
		const dx = x - p.x;
		const dy = y - p.y;
		if (Math.abs(dx) < MIN_DISTANCE && Math.abs(dy) < MIN_DISTANCE) {
			return true;
		}
	}
	return false;
}

/**
 * Show small floating shortcut badges on page elements that have letter keys.
 * Each badge shows the key (e.g. "AA") and optionally a label (tooltip/id).
 * Skips overlays that would visually overlap with an already-placed one.
 */
export function showShortcutOverlays(actions: Action[]) {
	removeShortcutOverlays();

	const withKeys = actions.filter(
		(a) => a.type === "interactive" && a.keys && a.keys.length > 0
	);

	const placed: PlacedOverlay[] = [];

	for (const action of withKeys) {
		if (!action.id) continue;

		const el = document.querySelector(
			`[${TARGET_ATTRIBUTE}="${CSS.escape(action.id)}"]`
		) as HTMLElement | null;
		if (!el) continue;

		const rect = el.getBoundingClientRect();
		if (rect.width === 0 || rect.height === 0) continue;

		const scrollX = window.scrollX;
		const scrollY = window.scrollY;
		const posX = rect.left + scrollX;
		const posY = rect.bottom + scrollY + 4;

		// Skip if another overlay is already at nearly the same position
		if (overlaps(posX, posY, placed)) continue;
		placed.push({ x: posX, y: posY });

		const overlay = document.createElement("div");
		overlay.className = OVERLAY_CLASS;

		// Key badge
		const keySpan = document.createElement("span");
		keySpan.className = "scanny-overlay-key";
		keySpan.textContent = action.keys![0].toUpperCase();
		overlay.appendChild(keySpan);

		// Position
		overlay.style.left = `${posX}px`;
		overlay.style.top = `${posY}px`;

		document.body.appendChild(overlay);
	}
}

/**
 * Remove all shortcut overlays from the page.
 */
export function removeShortcutOverlays() {
	document
		.querySelectorAll(`.${OVERLAY_CLASS}`)
		.forEach((el) => el.remove());
}
