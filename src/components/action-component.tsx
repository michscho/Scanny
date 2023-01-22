import React from "react";
import { Action } from "../actions/data/types-data";

export interface ActionProps {
	action: Action;
	skip: string;
	img: string;
	index: number;
	keys: string;
}

export function ActionComponent({ action, img, index, keys }: ActionProps) {
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

	return (
		<div
			className={index === 0 ? "omni-item omni-item-active" : "omni-item"}
			data-index={index}
			data-type={action.type}
		>
			<Img action={action} />
			<div className="omni-item-details">
				<div className="omni-item-name">{action.title}</div>
				<div className="omni-item-desc">{action.description}</div>
			</div>
			{action.keys ? <Keys action={action} /> : ""}
			<div className="omni-select">
				Select <span className="omni-shortcut">⏎</span>
			</div>
		</div>
	);
}

interface KeysProps {
	action: Action;
}

function Keys(action: KeysProps) {
	return (
		<div className="omni-keys">
			{action.action.keys.map((key: any) => (
				<span className="omni-shortcut">{key}</span>
			))}
		</div>
	);
}

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
