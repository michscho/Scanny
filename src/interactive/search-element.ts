import { createInteractiveAction } from "../actions/create-action";
import { Action } from "../actions/data/types-data";
import $ from "jquery";
import { Scanny, ElementsActionRecord } from "./elements-actions";

type TextExtractor = (el: JQueryElement) => string | undefined;
type JQueryElement = JQuery<HTMLElement>;

const MAX_RESULTS_PER_TYPE = 25;
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
	if (el.getAttribute("aria-hidden") === "true") {
		return false;
	}
	if (el.getAttribute("aria-disabled") === "true") {
		return false;
	}
	const element = el as HTMLInputElement;
	if (typeof element.disabled === "boolean" && element.disabled) {
		return false;
	}
	const rect = el.getBoundingClientRect();
	return rect.width > 0 && rect.height > 0;
}

function computeMatchScore(query: string, text: string): number {
	const normalizedQuery = normalize(query);
	const normalizedText = normalize(text);
	if (!normalizedQuery) {
		return 1;
	}
	if (!normalizedText) {
		return 0;
	}
	const tokens = normalizedQuery.split(" ").filter(Boolean);
	if (!tokens.every((token) => normalizedText.includes(token))) {
		return 0;
	}
	let score = tokens.length * 10;
	if (normalizedText === normalizedQuery) score += 80;
	if (normalizedText.startsWith(normalizedQuery)) score += 50;
	if (normalizedText.includes(` ${normalizedQuery}`)) score += 20;
	return score;
}

export function findClickableElements(query: string): Action[] {
	const aActions = findElements(query, ElementsActionRecord.link);
	const buttonActions = findElements(query, ElementsActionRecord.button);
	const placeholderActions = findElements(
		query,
		ElementsActionRecord.placeholder,
		(el: JQueryElement) => el.attr("placeholder")
	);
	const spanActions = findElements(query, ElementsActionRecord.span);

	const textResults = [...aActions, ...buttonActions, ...placeholderActions, ...spanActions];

	// Also find clickable elements without text and assign letter keys
	const unlabeled = findUnlabeledElements(query);

	return [...textResults, ...unlabeled];
}

function ensureTargetId(el: HTMLElement): string {
	const existingId = el.getAttribute(TARGET_ATTRIBUTE);
	if (existingId) {
		return existingId;
	}
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
		: [
				htmlElement.text(),
				htmlElement.attr("aria-label"),
				htmlElement.attr("title"),
				htmlElement.attr("placeholder"),
				htmlElement.attr("alt"),
				htmlElement.attr("value"),
		  ].join(" ");
	// Trim and collapse whitespace
	return (extractedText || "").replace(/\s+/g, " ").trim();
}

function findElements(
	query: string,
	element: Scanny,
	textExtractor?: TextExtractor
): Action[] {
	const scoredActions: Array<{ action: Action; score: number }> = [];
	$(element.selector)
		.filter(element.filter(query))
		.each(function () {
			if (scoredActions.length >= MAX_RESULTS_PER_TYPE) return false;
			const target = this as HTMLElement;
			if (!isVisibleAndEnabled(target)) {
				return;
			}
			const jqElement = $(this);
			const text = getHTMLElementText(jqElement, textExtractor);
			const score = computeMatchScore(query, text);
			if (text !== "" && text.length < 200 && score > 0) {
				const id = ensureTargetId(target);
				scoredActions.push({
					action: createInteractiveAction(
						text,
						element.description,
						element.icon,
						id
					),
					score,
				});
			}
		});
	return scoredActions
		.sort((a, b) => b.score - a.score)
		.map((entry) => entry.action);
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
 * Describe an unlabeled element using tag name, attributes, or nearby text.
 */
function describeElement(el: HTMLElement): string {
	// Try aria-label, title, alt, value first
	const ariaLabel = el.getAttribute("aria-label");
	if (ariaLabel) return ariaLabel.trim();
	const title = el.getAttribute("title");
	if (title) return title.trim();
	const alt = el.getAttribute("alt");
	if (alt) return alt.trim();

	// Try inner img alt or svg title
	const img = el.querySelector("img[alt]");
	if (img && img.getAttribute("alt")) return img.getAttribute("alt")!.trim();
	const svgTitle = el.querySelector("svg title");
	if (svgTitle?.textContent) return svgTitle.textContent.trim();

	// Use tag + type or role
	const tag = el.tagName.toLowerCase();
	const role = el.getAttribute("role") || "";
	const type = el.getAttribute("type") || "";
	const cls = el.className?.toString().split(/\s+/).filter(Boolean).slice(0, 2).join(".");

	if (type) return `${tag}[${type}]${cls ? " ." + cls : ""}`;
	if (role) return `${tag}[${role}]${cls ? " ." + cls : ""}`;
	return `${tag}${cls ? " ." + cls : ""}`;
}

/**
 * Find clickable elements that have no visible text and assign letter keys.
 */
function findUnlabeledElements(query: string): Action[] {
	const selectors = [
		"a:not(.scanny-extension a)",
		"button:not(.scanny-extension button)",
		"[role='button']:not(.scanny-extension [role='button'])",
		"input[type='button']:not(.scanny-extension input)",
		"input[type='submit']:not(.scanny-extension input)",
		"[onclick]:not(.scanny-extension [onclick])",
	];

	const allClickable = $(selectors.join(", "));
	const results: Action[] = [];
	let keyIndex = 0;

	allClickable.each(function () {
		if (results.length >= MAX_RESULTS_PER_TYPE) return false;

		const el = this as HTMLElement;
		if (!isVisibleAndEnabled(el)) return;

		// Skip elements that already have searchable text
		const textContent = (el.textContent || "").replace(/\s+/g, " ").trim();
		if (textContent.length > 0 && textContent.length < 200) return;

		const key = generateKey(keyIndex);
		keyIndex++;

		const description = describeElement(el);
		const id = ensureTargetId(el);

		// If there's a query, check if the key or description matches
		if (query) {
			const q = normalize(query);
			const matchesKey = key.startsWith(q);
			const matchesDesc = normalize(description).includes(q);
			if (!matchesKey && !matchesDesc) return;
		}

		const action = createInteractiveAction(
			description || `Element ${key}`,
			"Clickable element",
			"🏷️",
			id
		);
		action.keys = [key];
		results.push(action);
	});

	return results;
}
