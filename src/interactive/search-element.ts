import { createInteractiveAction } from "../actions/create-action";
import { Action } from "../actions/data/types-data";
import $ from "jquery";
import {
	Scanny,
	ElementsActionRecord,
	buildSearchText,
	queryMatches,
} from "./elements-actions";

type TextExtractor = (el: JQueryElement) => string | undefined;
type JQueryElement = JQuery<HTMLElement>;

const MAX_RESULTS_PER_TYPE = 30;
const MAX_TOTAL_RESULTS = 80;
const TARGET_ATTRIBUTE = "data-scanny-target-id";
let targetCounter = 0;

function normalize(value: string) {
	return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function isVisibleAndEnabled(el: HTMLElement): boolean {
	const style = window.getComputedStyle(el);
	if (
		style.display === "none" ||
		style.visibility === "hidden" ||
		style.pointerEvents === "none"
	) {
		return false;
	}
	if (style.opacity === "0") return false;
	if (el.getAttribute("aria-hidden") === "true") return false;
	if (el.getAttribute("aria-disabled") === "true") return false;
	const element = el as HTMLInputElement;
	if (typeof element.disabled === "boolean" && element.disabled) return false;
	const rect = el.getBoundingClientRect();
	return rect.width > 0 && rect.height > 0;
}

function computeMatchScore(query: string, text: string): number {
	const normalizedQuery = normalize(query);
	const normalizedText = normalize(text);
	if (!normalizedQuery) return 1;
	if (!normalizedText) return 0;
	const tokens = normalizedQuery.split(" ").filter(Boolean);
	if (!tokens.every((token) => normalizedText.includes(token))) return 0;
	let score = tokens.length * 10;
	if (normalizedText === normalizedQuery) score += 80;
	if (normalizedText.startsWith(normalizedQuery)) score += 50;
	if (normalizedText.includes(` ${normalizedQuery}`)) score += 20;
	return score;
}

function ensureTargetId(el: HTMLElement): string {
	const existingId = el.getAttribute(TARGET_ATTRIBUTE);
	if (existingId) return existingId;
	const id = `scanny-target-${Date.now()}-${targetCounter++}`;
	el.setAttribute(TARGET_ATTRIBUTE, id);
	return id;
}

function getHTMLElementText(
	htmlElement: JQueryElement,
	textExtractor?: TextExtractor
) {
	const extractedText = textExtractor
		? textExtractor(htmlElement)
		: buildSearchText(htmlElement[0]);
	return (extractedText || "").replace(/\s+/g, " ").trim();
}

/**
 * Get a short human-readable description for an element.
 * Returns empty string if nothing useful is found.
 */
function describeElement(el: HTMLElement): string {
	// Try accessible attributes first
	const ariaLabel = el.getAttribute("aria-label");
	if (ariaLabel) return ariaLabel.trim();
	const title = el.getAttribute("title");
	if (title) return title.trim();
	const alt = el.getAttribute("alt");
	if (alt) return alt.trim();
	const placeholder = el.getAttribute("placeholder");
	if (placeholder) return placeholder.trim();

	// Try text content (short only)
	const text = (el.textContent || "").replace(/\s+/g, " ").trim();
	if (text.length > 0 && text.length < 80) return text;

	// Try inner img alt or svg title
	const img = el.querySelector("img[alt]");
	if (img && img.getAttribute("alt")) return img.getAttribute("alt")!.trim();
	const svgTitle = el.querySelector("svg title");
	if (svgTitle?.textContent) return svgTitle.textContent.trim();

	return "";
}

/**
 * Check if an element has human-readable text.
 */
function hasReadableText(el: HTMLElement): boolean {
	return describeElement(el).length > 0;
}

/**
 * Turn an identifier like "settings-btn" or "navToggle" into "settings btn" / "nav toggle".
 */
function humanizeIdentifier(str: string): string {
	return str
		.replace(/[-_]+/g, " ")
		.replace(/([a-z])([A-Z])/g, "$1 $2")
		.replace(/\s+/g, " ")
		.trim()
		.toLowerCase();
}

/**
 * Build a smart label for an element using tooltip, id, name, data-* attributes.
 * Returns empty string if nothing useful is found.
 */
function buildSmartLabel(el: HTMLElement): string {
	// Tooltip-like attributes
	const tooltip =
		el.getAttribute("data-tooltip") ||
		el.getAttribute("data-tip") ||
		el.getAttribute("data-original-title") ||
		el.getAttribute("data-title");
	if (tooltip?.trim()) return tooltip.trim();

	// title attribute (might have been missed if element structure is odd)
	const title = el.getAttribute("title");
	if (title?.trim()) return title.trim();

	// aria-label (double-check since describeElement may have missed parent)
	const ariaLabel = el.getAttribute("aria-label");
	if (ariaLabel?.trim()) return ariaLabel.trim();

	// aria-describedby
	const describedBy = el.getAttribute("aria-describedby");
	if (describedBy) {
		const descEl = document.getElementById(describedBy);
		if (descEl?.textContent?.trim()) return descEl.textContent.trim();
	}

	// name attribute (common on form elements)
	const name = el.getAttribute("name");
	if (name?.trim() && name.length < 50) return humanizeIdentifier(name);

	// data-testid / data-test-id (useful in React/dev sites)
	const testId =
		el.getAttribute("data-testid") || el.getAttribute("data-test-id");
	if (testId?.trim() && testId.length < 50) return humanizeIdentifier(testId);

	// id attribute
	const id = el.id;
	if (
		id &&
		id.length < 50 &&
		!id.startsWith("scanny-") &&
		!/^[0-9a-f]{8,}$/i.test(id)
	) {
		return humanizeIdentifier(id);
	}

	return "";
}

/**
 * Generate two-letter keys: aa, ab, ac, ... az, ba, bb, ...
 */
function generateKey(index: number): string {
	const a = "a".charCodeAt(0);
	const first = String.fromCharCode(a + Math.floor(index / 26));
	const second = String.fromCharCode(a + (index % 26));
	return first + second;
}

/**
 * Find all clickable/interactive elements on the page matching the query.
 * Uses expanded selectors, deduplication, and cursor:pointer detection.
 */
export function findClickableElements(query: string): Action[] {
	const seen = new WeakSet<HTMLElement>();
	const allResults: Array<{ action: Action; score: number }> = [];

	// 1. Iterate all element categories
	const categoryOrder = [
		"link",
		"button",
		"input",
		"checkbox",
		"menu",
		"interactive",
	];
	for (const key of categoryOrder) {
		const cat = ElementsActionRecord[key];
		if (!cat) continue;
		const actions = findElements(query, cat, seen);
		allResults.push(...actions);
	}

	// 2. Find elements with cursor:pointer that weren't caught by selectors
	const cursorActions = findCursorPointerElements(query, seen);
	allResults.push(...cursorActions);

	// 3. Find unlabeled elements and assign letter keys
	// 3. Find unlabeled elements — split into smart-labeled (scored) and truly unlabeled (letter keys)
	const { keyResults, smartResults } = findUnlabeledElements(query, seen);

	// Merge smart-labeled results into scored pool
	allResults.push(...smartResults);

	// Sort scored results, then append letter-key results
	allResults.sort((a, b) => b.score - a.score);
	const results = allResults
		.slice(0, MAX_TOTAL_RESULTS)
		.map((entry) => entry.action);
	results.push(...keyResults);

	return results;
}

function findElements(
	query: string,
	element: Scanny,
	seen: WeakSet<HTMLElement>,
	textExtractor?: TextExtractor
): Array<{ action: Action; score: number }> {
	const scoredActions: Array<{ action: Action; score: number }> = [];
	$(element.selector)
		.filter(element.filter(query))
		.each(function () {
			if (scoredActions.length >= MAX_RESULTS_PER_TYPE) return false;
			const target = this as HTMLElement;
			if (seen.has(target)) return;
			if (!isVisibleAndEnabled(target)) return;

			// Skip elements without readable text – they go to unlabeled with keys
			if (!hasReadableText(target)) return;

			const jqElement = $(this);
			const text = getHTMLElementText(jqElement, textExtractor);
			const score = computeMatchScore(query, text);
			if (score > 0) {
				const displayText = describeElement(target);
				if (!displayText) return;
				const id = ensureTargetId(target);
				seen.add(target);
				scoredActions.push({
					action: createInteractiveAction(
						displayText,
						element.description,
						element.icon,
						id
					),
					score,
				});
			}
		});
	return scoredActions;
}

/**
 * Detect elements with CSS cursor:pointer that weren't caught by standard selectors.
 * Elements WITH text get scored results; elements WITHOUT text are collected
 * for the unlabeled pass (which assigns letter keys).
 */
function findCursorPointerElements(
	query: string,
	seen: WeakSet<HTMLElement>
): Array<{ action: Action; score: number }> {
	const results: Array<{ action: Action; score: number }> = [];
	const startTime = performance.now();
	const TIME_BUDGET_MS = 80;

	const candidates = document.querySelectorAll(
		"div, span, li, img, svg, i, p, td, th, figure, article, section, nav, " +
			"a:not([href])"
	);

	for (let i = 0; i < candidates.length && results.length < MAX_RESULTS_PER_TYPE; i++) {
		if (i % 100 === 0 && performance.now() - startTime > TIME_BUDGET_MS) break;

		const el = candidates[i] as HTMLElement;
		if (seen.has(el)) continue;
		if (el.closest(".scanny-extension")) continue;
		if (!isVisibleAndEnabled(el)) continue;

		const style = window.getComputedStyle(el);
		if (style.cursor !== "pointer") continue;
		if (el.children.length > 12) continue;

		// Elements without readable text will be caught by findUnlabeledElements
		if (!hasReadableText(el)) continue;

		const displayText = describeElement(el);
		const searchText = buildSearchText(el);
		const score = query
			? computeMatchScore(query, searchText || displayText)
			: 1;
		if (score <= 0 && query) continue;

		const id = ensureTargetId(el);
		seen.add(el);
		results.push({
			action: createInteractiveAction(
				displayText,
				"Clickable element",
				"👆",
				id
			),
			score: score || 1,
		});
	}

	return results;
}

/**
 * Find ALL clickable elements without readable text (from selectors AND cursor:pointer)
 * and assign searchable letter-key shortcuts (aa, ab, ac, ...).
 */
function findUnlabeledElements(
	query: string,
	seen: WeakSet<HTMLElement>
): { keyResults: Action[]; smartResults: Array<{ action: Action; score: number }> } {
	// Collect candidates from standard selectors
	const selectorCandidates = $(
		[
			"a",
			"button",
			"[role='button']",
			"input[type='button']",
			"input[type='submit']",
			"[onclick]",
			"[tabindex]:not([tabindex='-1'])",
		].join(", ")
	).toArray() as HTMLElement[];

	// Also collect cursor:pointer elements that were skipped
	const cursorCandidates: HTMLElement[] = [];
	const cpElements = document.querySelectorAll(
		"div, span, li, img, svg, i, p, td, th, figure, article, section, nav, a:not([href])"
	);
	const startTime = performance.now();
	for (let i = 0; i < cpElements.length; i++) {
		if (i % 100 === 0 && performance.now() - startTime > 60) break;
		const el = cpElements[i] as HTMLElement;
		if (seen.has(el)) continue;
		if (el.closest(".scanny-extension")) continue;
		if (!isVisibleAndEnabled(el)) continue;
		const style = window.getComputedStyle(el);
		if (style.cursor !== "pointer") continue;
		if (el.children.length > 12) continue;
		cursorCandidates.push(el);
	}

	const allCandidates = [...selectorCandidates, ...cursorCandidates];
	const keyResults: Action[] = [];
	const smartResults: Array<{ action: Action; score: number }> = [];
	let keyIndex = 0;

	for (const el of allCandidates) {
		if (keyResults.length + smartResults.length >= MAX_RESULTS_PER_TYPE) break;
		if (seen.has(el)) continue;
		if (el.closest(".scanny-extension")) continue;
		if (!isVisibleAndEnabled(el)) continue;

		// Only grab elements that have NO readable text
		if (hasReadableText(el)) continue;

		const smartLabel = buildSmartLabel(el);
		const tag = el.tagName.toLowerCase();
		const role = el.getAttribute("role") || "";
		const type = (el as HTMLInputElement).type || "";
		let tagLabel = tag;
		if (role) tagLabel = `${tag}[${role}]`;
		else if (type && type !== tag) tagLabel = `${tag}[${type}]`;

		const id = ensureTargetId(el);
		seen.add(el);

		if (smartLabel) {
			// Has a useful label (tooltip, id, etc.) → scored result, NO letter key
			const title = smartLabel;
			const desc = `${smartLabel} · ${tagLabel}`;

			if (query) {
				const score = computeMatchScore(query, smartLabel);
				if (score <= 0) continue;
				const action = createInteractiveAction(title, desc, "🏷️", id);
				smartResults.push({ action, score });
			} else {
				const action = createInteractiveAction(title, desc, "🏷️", id);
				smartResults.push({ action, score: 1 });
			}
		} else {
			// Truly unlabeled → assign letter key
			const key = generateKey(keyIndex);
			keyIndex++;

			if (query) {
				const q = normalize(query);
				if (!key.startsWith(q)) continue;
			}

			const action = createInteractiveAction(
				tagLabel,
				`Clickable element · ${tagLabel}`,
				"🏷️",
				id
			);
			action.keys = [key];
			keyResults.push(action);
		}
	}

	return { keyResults, smartResults };
}
