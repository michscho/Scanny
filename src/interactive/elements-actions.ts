type ScannyRecord = Record<string, Scanny>;

export interface Scanny {
	description: string;
	selector: string;
	icon: string;
	filter: (query: string) => (index: number, element: HTMLElement) => boolean;
}

function normalize(value: string) {
	return value.toLowerCase().replace(/\s+/g, " ").trim();
}

/**
 * Build a comprehensive search text from an element's content and attributes.
 * Includes text content, ARIA attributes, inner images, SVG titles, and
 * associated labels for input elements.
 */
export function buildSearchText(el: HTMLElement): string {
	const parts: string[] = [];

	// Direct text content (limit to avoid huge containers)
	const text = el.textContent || "";
	if (text.length < 500) parts.push(text);

	// All accessible attributes
	for (const attr of [
		"aria-label",
		"title",
		"placeholder",
		"alt",
		"value",
		"name",
		"aria-description",
		"aria-roledescription",
	]) {
		const val = el.getAttribute(attr);
		if (val) parts.push(val);
	}

	// Inner img alt or svg title
	const img = el.querySelector("img[alt]");
	if (img) parts.push(img.getAttribute("alt") || "");
	const svgTitle = el.querySelector("svg title");
	if (svgTitle?.textContent) parts.push(svgTitle.textContent);

	// Associated label for input elements
	if (el.id) {
		const label = document.querySelector(`label[for="${CSS.escape(el.id)}"]`);
		if (label?.textContent) parts.push(label.textContent);
	}

	// href for links (so users can search by URL)
	const href = el.getAttribute("href");
	if (href && !href.startsWith("javascript:")) parts.push(href);

	return normalize(parts.join(" "));
}

function isNotScannyElement(el: HTMLElement): boolean {
	return !el.closest(".scanny-extension");
}

export function queryMatches(query: string, el: HTMLElement): boolean {
	if (!isNotScannyElement(el)) return false;
	const normalizedQuery = normalize(query);
	if (!normalizedQuery) return true;
	const haystack = buildSearchText(el);
	return normalizedQuery
		.split(" ")
		.filter(Boolean)
		.every((token) => haystack.includes(token));
}

export const ElementsActionRecord: ScannyRecord = {
	link: {
		description: "Clickable link",
		selector: "a",
		icon: "🔗",
		filter: (query) => (_i, el) => queryMatches(query, el),
	},
	button: {
		description: "Clickable button",
		selector: [
			"button",
			"[role='button']",
			"input[type='button']",
			"input[type='submit']",
			"input[type='reset']",
		].join(", "),
		icon: "🔘",
		filter: (query) => (_i, el) => queryMatches(query, el),
	},
	input: {
		description: "Input field",
		selector: [
			"input:not([type='hidden']):not([type='button']):not([type='submit']):not([type='reset']):not([type='checkbox']):not([type='radio'])",
			"textarea",
			"select",
			"[contenteditable='true']",
			"[contenteditable='']",
			"[role='textbox']",
			"[role='searchbox']",
			"[role='combobox']",
		].join(", "),
		icon: "✏️",
		filter: (query) => (_i, el) => queryMatches(query, el),
	},
	checkbox: {
		description: "Toggle/Checkbox",
		selector: [
			"input[type='checkbox']",
			"input[type='radio']",
			"[role='checkbox']",
			"[role='radio']",
			"[role='switch']",
		].join(", "),
		icon: "☑️",
		filter: (query) => (_i, el) => queryMatches(query, el),
	},
	menu: {
		description: "Menu item",
		selector: [
			"[role='menuitem']",
			"[role='menuitemcheckbox']",
			"[role='menuitemradio']",
			"[role='tab']",
			"[role='option']",
			"[role='treeitem']",
		].join(", "),
		icon: "📋",
		filter: (query) => (_i, el) => queryMatches(query, el),
	},
	interactive: {
		description: "Interactive element",
		selector: [
			"[tabindex]:not([tabindex='-1'])",
			"[onclick]",
			"summary",
			"details",
			"[role='link']",
			"[role='slider']",
			"[role='spinbutton']",
			"[role='progressbar'][tabindex]",
			"label[for]",
			"[draggable='true']",
			"video[controls]",
			"audio[controls]",
		].join(", "),
		icon: "👆",
		filter: (query) => (_i, el) => queryMatches(query, el),
	},
};

export function mapDescriptionToScanny(
	description: string
): Scanny | undefined {
	for (const key of Object.keys(ElementsActionRecord)) {
		if (ElementsActionRecord[key].description === description) {
			return ElementsActionRecord[key];
		}
	}
	return undefined;
}
