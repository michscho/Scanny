import { css } from "@emotion/react";
import { Action } from "../actions/data/types-data";
import { useState } from "react";

export interface ActionProps {
	action: Action;
	index: number;
	isSelected: boolean;
	query?: string;
}

/** Highlights all occurrences of `query` within `text`. */
function HighlightText({ text, query }: { text: string; query?: string }) {
	if (!query || query.length === 0) return <>{text}</>;

	const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	const regex = new RegExp(`(${escaped})`, "gi");
	const parts = text.split(regex);

	if (parts.length === 1) return <>{text}</>;

	return (
		<>
			{parts.map((part, i) =>
				i % 2 === 1 ? (
					<span key={i} css={highlightStyle}>
						{part}
					</span>
				) : (
					<span key={i}>{part}</span>
				)
			)}
		</>
	);
}

const highlightStyle = css`
	color: var(--accent, #5e9cff);
	font-weight: 700;
	background: color-mix(in srgb, var(--accent, #5e9cff) 14%, transparent);
	border-radius: 3px;
	padding: 0 1px;
`;

export function ActionComponent({
	action,
	index,
	isSelected,
	query,
}: ActionProps) {
	const isInteractive = action.type === "interactive";

	return (
		<div className="scanny-item" data-index={index} data-type={action.type}>
			{action.emojiChar ? (
				<span className="scanny-emoji-action">{action.emojiChar}</span>
			) : (
				<Img action={action} />
			)}
			<div className="scanny-item-details">
				<div className="scanny-item-name-row">
					<div className="scanny-item-name">
						<HighlightText text={action.title} query={query} />
					</div>
					{isInteractive ? (
						<span className="scanny-item-badge" aria-label="Page element result">
							Element
						</span>
					) : null}
				</div>
				<div
					className={`scanny-item-desc ${isInteractive ? "scanny-item-desc-interactive" : ""}`}
				>
					{isInteractive ? (
						<InteractiveDescription text={action.description} query={query} />
					) : (
						<HighlightText text={action.description} query={query} />
					)}
				</div>
			</div>
			{action.keys && !isSelected ? <Keys action={action} /> : ""}
			{isSelected && (
				<div css={selectStyle}>
					Select <span css={shortcut}>⏎</span>
				</div>
			)}
		</div>
	);
}

function InteractiveDescription({
	text,
	query,
}: {
	text: string;
	query?: string;
}) {
	const parts = text
		.split(" · ")
		.map((part) => part.trim())
		.filter(Boolean);

	if (parts.length <= 1) {
		return <HighlightText text={text} query={query} />;
	}

	return (
		<>
			{parts.map((part, i) => (
				<span className="scanny-meta-pill" key={`${part}-${i}`}>
					<HighlightText text={part} query={query} />
				</span>
			))}
		</>
	);
}

const selectStyle = css`
	margin-left: auto;
	color: var(--text-3);
	font-size: 12px;
	font-weight: 600;
	margin-top: 0;
	margin-right: 0;
	gap: 6px;
	opacity: 0.94;
	display: flex !important;
	align-items: center;
	white-space: nowrap;
	flex-shrink: 0;
`;

interface KeysProps {
	action: Action;
}

function Keys(action: KeysProps) {
	return (
		<div className="scanny-keys">
			{action.action.keys?.map((key: any, index: number) => (
				<span css={shortcut} key={index}>
					{key}
				</span>
			))}
		</div>
	);
}

const shortcut = css`
	display: inline-block !important;
	font-size: 12px;
	font-weight: 600;
	border-radius: 5px;
	background-color: var(--chip-bg);
	color: var(--chip-text);
	text-align: center;
	height: 20px;
	line-height: 20px;
	min-width: 22px;
	padding-left: 5px;
	padding-right: 5px;
`;

interface ImgProps {
	action: Action;
}

function Img(action: ImgProps) {
	const fallbackIcon = chrome.runtime.getURL("/icons/globe.svg");
	const [imgSrc, setImgSrc] = useState(action.action.favIconUrl || fallbackIcon);

	return (
		<img
			src={imgSrc}
			onError={() => setImgSrc(fallbackIcon)}
			alt="favicon"
			className="scanny-icon"
		/>
	);
}
