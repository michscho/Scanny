import React from "react";
import "../../public/content.css";
import { ActionComponent } from "./action-component";
import { Toast } from "./toast";
import { FixedSizeList as List } from "react-window";

interface SearchProps {
	actions: any[];
}

export function Search(search: SearchProps): JSX.Element {
	return (
		<div>
			<div id="omni-wrap">
				<div id="omni">
					<div id="omni-search">
						<input placeholder="Type a command or search" />
					</div>
					<div id="omni-list">
						<List height={400} itemCount={search.actions.length} itemSize={50}>
							{({ index, style }) => (
								<div style={style}>
									<ActionComponent
										action={search.actions[index]}
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
