import React from "react";
import "../../public/content.css";
import { ActionComponent } from "./action-component";
import { Toast } from "./toast";
import { FixedSizeList as List } from "react-window";
import $ from "jquery";
import { search } from "../search/search";
import { Action } from "../actions/actions-data";
import { handleAction } from "../actions/handle-action";
import { hoverItem } from "../omni/utils";

interface AppProps {
	actions: Action[];
}

export function App(searchProps: AppProps): JSX.Element {
	//const [action, setActions] = useState(searchProps.actions);

	$(document).on("keyup", ".omni-extension input", (e) =>
		search(e, searchProps.actions, false)
	);
	$(document).on("click", ".omni-item-active", handleAction);
	$(document).on(
		"mouseover",
		".omni-extension .omni-item:not(.omni-item-active)",
		hoverItem
	);

	return (
		<div>
			<div id="omni-wrap">
				<div id="omni">
					<div id="omni-search">
						<input placeholder="Type a command or search" />
					</div>
					<div id="omni-list">
						<List
							height={400}
							itemCount={searchProps.actions.length}
							itemSize={60}
						>
							{({ index, style }) => (
								<div style={style}>
									<ActionComponent
										action={searchProps.actions[index]}
										skip=""
										img=""
										index={index}
										keys=""
									/>
								</div>
							)}
						</List>
					</div>
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
