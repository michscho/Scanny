import React, { useState } from "react";
import "../../public/content.css";
import { ActionComponent } from "./action-component";
import { Toast } from "./toast";
import { FixedSizeList as List } from "react-window";
import $ from "jquery";
import { search } from "../search/search";
import { Action } from "../actions/actions-data";
import { handleAction } from "../actions/handle-action";
import { hoverItem } from "../omni/utils";
import { Footer } from "./footer";

interface AppProps {
	actions: Action[];
}

export function App(searchProps: AppProps): JSX.Element {
	const [action, setActions] = useState(searchProps.actions);

	$(document).on("keyup", ".omni-extension input", (e) =>
		search(e, searchProps.actions, false, setActions)
	);
	$(document).on("click", ".omni-item-active", (e) =>
		handleAction(e, action, true, setActions)
	);
	$(document).on(
		"mouseover",
		".omni-extension .omni-item:not(.omni-item-active)",
		hoverItem
	);

	return <SearchApp actions={action} />;
}

export function SearchApp(searchProps: AppProps): JSX.Element {
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
					<Footer></Footer>
				</div>
			</div>
			<div id="omni-overlay"></div>
			<Toast />
		</div>
	);
}
