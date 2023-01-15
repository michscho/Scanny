import React from "react";

export function Action(action, skip, img, index, keys) {
	return (
		<div
			className="omni-item omni-item-active"
			{...skip}
			data-index={index}
			data-type={action.type}
		>
			{img}
			<div className="omni-item-details">
				<div className="omni-item-name">{action.title}</div>
				<div className="omni-item-desc">{action.desc}</div>
			</div>
			{keys}
			<div className="omni-select">
				Select <span className="omni-shortcut">⏎</span>
			</div>
		</div>
	);
}
