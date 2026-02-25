import { Action } from "../actions/data/types-data";
import { findClickableElements } from "../interactive/search-element";

export function handleHistory(
	query: string,
	setActions: React.Dispatch<React.SetStateAction<Action[]>>
) {
	var tempvalue = query.replace("/history ", "");
	chrome.runtime.sendMessage(
		{ request: "search-history", query: tempvalue },
		(response) => {
			setActions(response.history);
		}
	);
}

export function handleBookmarks(
	query: string,
	setActions: React.Dispatch<React.SetStateAction<Action[]>>
) {
	var tempvalue = query.replace("/bookmarks ", "");
	if (tempvalue !== "") {
		chrome.runtime.sendMessage(
			{ request: "search-bookmarks", query: tempvalue },
			(response) => {
				setActions(response.bookmarks);
			}
		);
	}
}

export function handleInteractive(query: string) {
	return findClickableElements(query.replace(/^>\s*/, ""));
}

export function handleTabs(
	query: string,
	setActions: React.Dispatch<React.SetStateAction<Action[]>>
) {
	const tabQuery = query.replace(/^\/tabs\s*/, "");
	chrome.runtime.sendMessage(
		{ request: "search-tabs", query: tabQuery },
		(response) => {
			setActions(response?.tabs ?? []);
		}
	);
}

export function handleAskAI(
	query: string,
	setActions: React.Dispatch<React.SetStateAction<Action[]>>
) {
	const prompt = query.replace(/^\/ai\s*/, "").trim();
	if (!prompt) {
		setActions([
			{
				title: "Ask AI",
				description: "Type /ai followed by your question",
				type: "action",
				action: "none",
				emojiChar: "🤖",
			},
		]);
		return;
	}

	setActions([
		{
			title: "Thinking...",
			description: "Asking AI",
			type: "action",
			action: "none",
			emojiChar: "⏳",
		},
	]);

	chrome.runtime.sendMessage(
		{ request: "ask-ai", query: prompt },
		(response: { answer?: string; error?: string } | undefined) => {
			if (response?.error === "missing-key") {
				setActions([
					{
						title: "Open Settings to add your OpenAI key",
						description: "Add your API key in Scanny Settings, then run /ai again",
						type: "action",
						action: "open-scanny-settings",
						emojiChar: "⚙️",
					},
				]);
				return;
			}

			if (response?.error) {
				setActions([
					{
						title: "AI request failed",
						description: response.error,
						type: "action",
						action: "none",
						emojiChar: "⚠️",
					},
				]);
				return;
			}

			const answer = response?.answer?.trim();
			if (!answer) {
				setActions([
					{
						title: "No AI answer",
						description: "Try a more specific prompt",
						type: "action",
						action: "none",
						emojiChar: "🤖",
					},
				]);
				return;
			}

			const compact = answer.replace(/\s+/g, " ");
			setActions([
				{
					title:
						compact.length > 100 ? `${compact.slice(0, 100).trimEnd()}...` : compact,
					description: answer,
					type: "action",
					action: "copy-ai-answer",
					emojiChar: "🤖",
					keys: ["⏎", "Copy"],
				},
			]);
		}
	);
}

export function handleAction(query: string, actions: Action[]) {
	var tempvalue = query.replace("/actions ", "");
	if (tempvalue == "/actions") {
		return actions.filter((x) => x.type == "action");
	} else {
		tempvalue = query.replace("/actions ", "");
		return actions.filter(
			(x) =>
				x.title.toLowerCase().indexOf(query) > -1 ||
				x.description.toLowerCase().indexOf(query) > -1
		);
	}
}
