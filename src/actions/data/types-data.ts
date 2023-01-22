export interface Action extends BasicAction {
	action: string;
}

export interface UrlAction extends BasicAction {
	action: "url";
}

interface BasicAction {
	title: string;
	description: string;
	type: "action" | "bookmark" | "tab" | "history" | "interactive";
	id?: string;
	emojiChar?: string;
	favIconUrl?: string;
	keys?: string[];
	url?: string;
}
