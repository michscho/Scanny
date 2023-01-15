import React from "react";

import "./content.css";

export function App() {
	return (
		<div>
			<div id="omni-wrap">
				<div id="omni">
					<div id="omni-search">
						<input placeholder="Type a command or search" />
					</div>
					<div id="omni-list"></div>
					<div id="omni-footer">
						<div id="omni-results">153 results</div>
						<div id="omni-arrows">
							Use arrow keys <span className="omni-shortcut">↑</span>
							<span className="omni-shortcut">↓</span> to navigate
						</div>
					</div>
				</div>
			</div>
			<div id="omni-overlay"></div>
		</div>
		// <div id="omni-extension-toast">
		// 	<img src="" />
		// 	<span>The action has been successful</span>
		// </div>
	);
}
