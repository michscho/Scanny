type ScannyRecord = Record<string, Scanny>;

export interface Scanny {
	description: string;
	selector: string;
	icon: string;
	filter: (query: string) => string;
}

export const ElementsActionRecord: ScannyRecord = {
	link: {
		description: "Clickable link",
		selector: "a",
		icon: "🔗",
		filter: (query: string) => `:contains('${query}')`,
	},
	button: {
		description: "Clickable button",
		selector: "button",
		icon: "🔘",
		filter: (query: string) => `:contains('${query}')`,
	},
	placeholder: {
		description: "Placeholder",
		selector: "[placeholder]",
		icon: "🔖",
		filter: (query: string) => `[placeholder='${query}']`,
	},
	span: {
		description: "Clickable span",
		selector: "span",
		icon: "🔗",
		filter: (query: string) => `:contains('${query}')`,
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
