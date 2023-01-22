import { css } from "@emotion/react";
import React from "react";
import { Action } from "../actions/data/types-data";
import { handleAction } from "../search/handle-search";

export interface ActionProps {
	action: Action;
	skip: string;
	img: string;
	index: number;
	keys: string;
}

export function ActionComponent({ action, img, index, keys }: ActionProps) {
	// TODO: add on click on this item

	addGlobeIcon(action, index);
	return (
		<div data-index={index} data-type={action.type}>
			<Img action={action} />
			<div className="omni-item-details">
				<div className="omni-item-name">{action.title}</div>
				<div className="omni-item-desc">{action.description}</div>
			</div>
			{action.keys ? <Keys action={action} /> : ""}
			<div className="omni-select">
				Select <span css={shortcut}>⏎</span>
			</div>
		</div>
	);
}

function addGlobeIcon(action: Action, index: number) {
	if (!action.emojiChar) {
		var loadimg = new Image();
		loadimg.src = action.favIconUrl;

		// Favicon doesn't load, use a fallback
		loadimg.onerror = () => {
			$(".omni-item[data-index='" + index + "'] img").attr(
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
		<div className="omni-keys">
			{action.action.keys.map((key: any) => (
				<span css={shortcut}>{key}</span>
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
			className="omni-icon"
		/>
	);
}
