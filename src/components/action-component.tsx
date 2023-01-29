import { css } from "@emotion/react";
import { Action } from "../actions/data/types-data";

export interface ActionProps {
	action: Action;
	skip: string;
	img: string;
	index: number;
	keys: string;
	isSelected: boolean;
}

export function ActionComponent({
	action,
	img,
	index,
	keys,
	isSelected,
}: ActionProps) {
	// TODO: add on click on this item

	addGlobeIcon(action, index);
	return (
		<div data-index={index} data-type={action.type}>
			<Img action={action} />
			<div className="scanny-item-details">
				<div className="scanny-item-name">{action.title}</div>
				<div className="scanny-item-desc">{action.description}</div>
			</div>
			{action.keys && !isSelected ? <Keys action={action} /> : ""}
			{isSelected && (
				<div css={select}>
					Select <span css={shortcut}>⏎</span>
				</div>
			)}
		</div>
	);
}

const select = css`
	float: right;
	color: var(--text-3);
	font-size: 12px;
	font-weight: 500;
	display: none;
	margin-top: 20px;
	margin-right: 5%;
	margin-left: 3px;
	display: block !important;
`;

function addGlobeIcon(action: Action, index: number) {
	if (!action.emojiChar) {
		var loadimg = new Image();
		loadimg.src = action.favIconUrl || "";

		// Favicon doesn't load, use a fallback
		loadimg.onerror = () => {
			$(".scanny-item[data-index='" + index + "'] img").attr(
				"src",
				chrome.runtime.getURL("/icons/globe.svg")
			);
		};
	}
}

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
	font-size: 13px;
	border-radius: 5px;
	background-color: #383e4a;
	color: #f1f1f1;
	text-align: center;
	height: 20px;
	line-height: 20px;
	min-width: 20px;
	padding-left: 3px;
	padding-right: 3px;
`;

interface ImgProps {
	action: Action;
}

function Img(action: ImgProps) {
	return (
		<img
			src={
				action.action.favIconUrl
					? action.action.favIconUrl
					: chrome.runtime.getURL("/icons/globe.svg")
			}
			alt="favicon"
			className="scanny-icon"
		/>
	);
}
