import { checkShortHand } from "../extension/utils";
import {
	handleBookmarks,
	handleHistory,
	handleInteractive,
	handleAskAI,
	handleTabs,
} from "./handle-search";
import { filterSearchAndGoItems } from "../utils/utils";
import { resetActions } from "../actions/reset-actions";
import { Action } from "../actions/data/types-data";
import { helpData } from "../actions/data/pure-data/help-data";

/** Score how well `text` matches `query` (higher = better, 0 = no match). */
export function scoreMatch(text: string, query: string): number {
	const t = text.toLowerCase();
	const q = query.toLowerCase();
	if (!q) return 0;

	// Exact full match
	if (t === q) return 100;

	// Starts with query
	if (t.startsWith(q)) return 80;

	// Word-boundary match (query appears right after a space / punctuation)
	const wordBoundary = new RegExp(`(?:^|[\\s\\-_/])${escapeRegex(q)}`);
	if (wordBoundary.test(t)) return 60;

	// Substring (contains)
	if (t.includes(q)) return 40;

	// Individual word match – every query word is found somewhere
	const words = q.split(/\s+/).filter(Boolean);
	if (words.length > 1 && words.every((w) => t.includes(w))) return 30;

	// Fuzzy: all query chars appear in order
	let qi = 0;
	for (let i = 0; i < t.length && qi < q.length; i++) {
		if (t[i] === q[qi]) qi++;
	}
	if (qi === q.length) return 20;

	return 0;
}

function escapeRegex(s: string) {
	return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildQueryActions(value: string): Action[] {
	const rawQuery = value.trim();
	if (!rawQuery) {
		return [];
	}

	return [
		{
			title: `Search "${rawQuery}"`,
			description: "Search the web for this query",
			type: "action",
			action: "search",
			emojiChar: "🔍",
		},
		{
			title: `Go to ${rawQuery}`,
			description: "Open this as a website URL",
			type: "action",
			action: "goto",
			emojiChar: "🌐",
		},
	];
}

/**
 * Perform search based on the current input value.
 * Called from onChange so the value is already up-to-date.
 */
export function search(
	value: string,
	setActions: React.Dispatch<React.SetStateAction<Action[]>>,
	setActiveIndex?: (index: number) => void
) {
	const actions = resetActions();
	const query = value.toLowerCase();

	if (query.startsWith("/history")) {
		handleHistory(query, setActions);
		setActiveIndex?.(0);
		return;
	}

	if (query.startsWith("/bookmarks")) {
		handleBookmarks(query, setActions);
		setActiveIndex?.(0);
		return;
	}

	if (query.startsWith(">")) {
		setActions(handleInteractive(value));
		setActiveIndex?.(0);
		return;
	}

	if (query.startsWith("/help")) {
		setActions(helpData);
		setActiveIndex?.(0);
		return;
	}

	if (query.startsWith("/tabs")) {
		handleTabs(query, setActions);
		setActiveIndex?.(0);
		return;
	}

	if (query.startsWith("/ai")) {
		handleAskAI(value, setActions);
		setActiveIndex?.(0);
		return;
	}

	// Always include page elements in results
	const pageElements = handleInteractive(value);

	if (query === "") {
		const allActions = filterSearchAndGoItems(actions);
		setActions([...allActions, ...pageElements]);
		setActiveIndex?.(0);
		return;
	}

	// Score each action by how well title & description match the query
	const scored = filterSearchAndGoItems(actions)
		.map((action) => {
			const titleScore = scoreMatch(action.title, query);
			const descScore = scoreMatch(action.description, query);
			return { action, score: Math.max(titleScore, descScore * 0.8) };
		})
		.filter(({ score }) => score > 0)
		.sort((a, b) => b.score - a.score);

	// Score page elements and merge them with command results by score
	const scoredPage = pageElements.map((action) => {
		const titleScore = scoreMatch(action.title, query);
		const descScore = scoreMatch(action.description, query);
		// Boost elements whose letter-key matches the query — these should appear at the top
		const keyExact = action.keys?.some((k) => k.toLowerCase() === query);
		const keyPrefix = action.keys?.some((k) => k.toLowerCase().startsWith(query));
		const keyBoost = keyExact ? 200 : keyPrefix ? 150 : 0;
		return { action, score: Math.max(titleScore, descScore * 0.8, keyBoost, 15) };
	});

	const merged = [...scored, ...scoredPage]
		.sort((a, b) => b.score - a.score)
		.map((entry) => entry.action);

	// Only append "Search X" / "Go to X" for longer queries, at the bottom
	const queryActions = query.length > 2 ? buildQueryActions(value) : [];
	setActions([...merged, ...queryActions]);
	setActiveIndex?.(0);
}

function isSpecialKeyEvent(e: React.KeyboardEvent<HTMLInputElement>) {
	return (
		e.key === "ArrowDown" ||
		e.key === "Enter" ||
		e.key === "ArrowLeft" ||
		e.key === "ArrowRight" ||
		e.key === "ArrowUp"
	);
}

/**
 * Handle shorthand expansion on keydown (before value changes).
 * Returns true if a shorthand was expanded.
 */
export function handleShorthand(
	event: React.KeyboardEvent<HTMLInputElement>
): boolean {
	if (isSpecialKeyEvent(event)) return false;
	const query = event.currentTarget.value.toString().toLowerCase();
	checkShortHand(event, query);
	return false;
}
