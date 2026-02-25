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

function buildSearchText(el: HTMLElement) {
	const text = [
		el.textContent || "",
		el.getAttribute("aria-label") || "",
		el.getAttribute("title") || "",
		el.getAttribute("placeholder") || "",
		el.getAttribute("alt") || "",
		el.getAttribute("value") || "",
	].join(" ");
	return normalize(text);
}

function queryMatches(query: string, el: HTMLElement) {
	const normalizedQuery = normalize(query);
	if (!normalizedQuery) {
		return true;
	}
	const haystack = buildSearchText(el);
	return normalizedQuery
		.split(" ")
		.filter(Boolean)
		.every((token) => haystack.includes(token));
}

export const ElementsActionRecord: ScannyRecord = {
	link: {
		description: "Clickable link",
		selector: "a:not(.scanny-extension a)",
		icon: "🔗",
		filter: (query: string) => (_i: number, el: HTMLElement) =>
			queryMatches(query, el),
	},
	button: {
		description: "Clickable button",
		selector:
			"button:not(.scanny-extension button), [role='button']:not(.scanny-extension [role='button']), input[type='button']:not(.scanny-extension input[type='button']), input[type='submit']:not(.scanny-extension input[type='submit'])",
		icon: "🔘",
		filter: (query: string) => (_i: number, el: HTMLElement) =>
			queryMatches(query, el),
	},
	placeholder: {
		description: "Input field",
		selector: "[placeholder]:not(.scanny-extension [placeholder])",
		icon: "🔖",
		filter: (query: string) => (_i: number, el: HTMLElement) =>
			queryMatches(query, el),
	},
	span: {
		description: "Clickable span",
		selector: "span[onclick], span[role='button']:not(.scanny-extension span)",
		icon: "🔗",
		filter: (query: string) => (_i: number, el: HTMLElement) =>
			queryMatches(query, el),
	},
};

export function mapDescriptionToScanny(
	description: string
): Scanny | undefined {
	var key: Scanny | undefined;
	Object.keys(ElementsActionRecord).forEach((element) => {
		if (ElementsActionRecord[element].description === description) {
			key = ElementsActionRecord[element];
		}
	});
	return key;
}
