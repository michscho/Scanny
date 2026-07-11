import { css } from "@emotion/react";
import { Action } from "../actions/data/types-data";

export interface FooterProps {
	result: number;
	query: string;
	selected?: Action;
	onOpenSettings: () => void;
}

interface Mode {
	label: string;
	icon: string;
}

/** Derive the active search mode from the query prefix. */
function getMode(query: string): Mode {
	if (query.startsWith("> ")) return { label: "Page", icon: "🔍" };
	if (query.startsWith("/tabs")) return { label: "Tabs", icon: "📑" };
	if (query.startsWith("/history")) return { label: "History", icon: "🏛" };
	if (query.startsWith("/bookmarks")) return { label: "Bookmarks", icon: "⭐️" };
	if (query.startsWith("/ai")) return { label: "Ask AI", icon: "✨" };
	if (query.startsWith("/remove")) return { label: "Remove", icon: "🧹" };
	if (query.startsWith("/help")) return { label: "Help", icon: "❔" };
	return { label: "All", icon: "⌘" };
}

/** Human label for what Enter will do with the selected action. */
function getEnterLabel(selected?: Action): string {
	switch (selected?.type) {
		case "interactive":
			return "Click element";
		case "tab":
			return "Switch to tab";
		case "bookmark":
			return "Open bookmark";
		case "history":
			return "Open page";
		default:
			return "Run";
	}
}

export function Footer({ result, query, selected, onOpenSettings }: FooterProps) {
	const mode = getMode(query);
	return (
		<div css={style}>
			<div css={leftSection}>
				<span css={modeChip} title={`Active mode: ${mode.label}`}>
					<span css={modeIcon}>{mode.icon}</span>
					{mode.label}
				</span>
				<span css={resultStyle}>
					{result} {result === 1 ? "result" : "results"}
				</span>
			</div>
			<div css={rightSection}>
				{result > 0 && (
					<span css={hintGroup}>
						<span css={keycap}>↵</span>
						<span css={hintLabel}>{getEnterLabel(selected)}</span>
					</span>
				)}
				<span css={hintGroup} id="scanny-arrows">
					<span css={keycap}>↑</span>
					<span css={keycap}>↓</span>
					<span css={hintLabel}>Navigate</span>
				</span>
				<span css={hintGroup}>
					<span css={keycap}>esc</span>
					<span css={hintLabel}>Close</span>
				</span>
				<span css={divider} />
				<button
					type="button"
					css={settingsButton}
					onClick={onOpenSettings}
					title="Open Scanny settings"
				>
					<span css={settingsGear}>⚙</span>
					Settings
				</button>
			</div>
		</div>
	);
}

const style = css`
	height: 44px;
	border-top: 1px solid var(--border);
	background: color-mix(in srgb, var(--background-solid) 55%, transparent);
	padding: 0 14px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 12px;
	user-select: none;
`;

const leftSection = css`
	display: flex;
	align-items: center;
	gap: 10px;
	min-width: 0;
`;

const modeChip = css`
	display: inline-flex;
	align-items: center;
	gap: 5px;
	height: 22px;
	padding: 0 8px;
	border-radius: 6px;
	font-size: 11px;
	font-weight: 700;
	letter-spacing: 0.04em;
	text-transform: uppercase;
	color: var(--accent);
	background: color-mix(in srgb, var(--accent) 14%, transparent);
	border: 1px solid color-mix(in srgb, var(--accent) 30%, transparent);
	white-space: nowrap;
`;

const modeIcon = css`
	font-size: 11px;
	line-height: 1;
`;

const resultStyle = css`
	color: var(--text-3);
	font-size: 12px;
	font-weight: 600;
	white-space: nowrap;
	font-variant-numeric: tabular-nums;
`;

const rightSection = css`
	display: flex;
	align-items: center;
	gap: 12px;
	min-width: 0;
`;

const hintGroup = css`
	display: inline-flex;
	align-items: center;
	gap: 5px;
	white-space: nowrap;

	/* progressively hide textual hints when the palette gets narrow */
	@media (max-width: 560px) {
		display: none;
	}
`;

const hintLabel = css`
	color: var(--text-3);
	font-size: 12px;
	font-weight: 500;
`;

const keycap = css`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	font-size: 11px;
	font-weight: 700;
	border-radius: 5px;
	background-color: var(--chip-bg);
	color: var(--chip-text);
	border: 1px solid color-mix(in srgb, var(--border) 80%, transparent);
	box-shadow: 0 1px 0 color-mix(in srgb, var(--border) 90%, transparent);
	height: 20px;
	min-width: 20px;
	padding: 0 5px;
`;

const divider = css`
	width: 1px;
	height: 18px;
	background: var(--border);

	@media (max-width: 560px) {
		display: none;
	}
`;

const settingsButton = css`
	display: inline-flex;
	align-items: center;
	gap: 6px;
	height: 28px;
	border: 1px solid var(--border);
	background: color-mix(in srgb, var(--background-solid) 88%, white 12%);
	color: var(--text-2);
	font-size: 12px;
	font-weight: 600;
	border-radius: 7px;
	padding: 0 10px;
	cursor: pointer;
	white-space: nowrap;
	transition: border-color 0.15s ease, color 0.15s ease;

	:hover {
		border-color: color-mix(in srgb, var(--accent) 40%, var(--border));
		color: var(--text);
	}

	:focus-visible {
		outline: none;
		border-color: color-mix(in srgb, var(--accent) 60%, var(--border));
		box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 22%, transparent);
	}
`;

const settingsGear = css`
	font-size: 13px;
	line-height: 1;
`;
