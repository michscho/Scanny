import React from "react";
import { Action } from "../actions/actions-data";
import "./content.css";
import { Toast } from "./toast";

interface SearchProps {
	actions: Action[];
}

export function Search(search: SearchProps): JSX.Element {
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
			<Toast />
		</div>
	);
}
