import "../../public/content.css";
import { Action } from "../actions/data/types-data";
import { css, Global } from "@emotion/react";
import { SearchApp } from "./search-app";
import { closeExtension } from "../content";

export interface AppProps {
	actions: Action[];
}

export function App(searchProps: AppProps): JSX.Element {
	document.addEventListener("keydown", (event) => {
		if (event.key === "Escape") {
			closeExtension();
		}
	});
	return (
		<div>
			<div id="scanny-extension" className="scanny-extension">
				<SearchApp actions={searchProps.actions} />
			</div>
			<Global styles={globalStyle} />
		</div>
	);
}

const globalStyle = css`
	@media (prefers-color-scheme: dark) {
		.scanny-extension {
			--background: #281e1e9e;
			--border: #35373e;
			--text: #f1f1f1;
			--text-2: #c5c6ca;
			--text-3: #a5a5ae;
			--select: #17191e84;
			--accent: #6068d2;
			--accent-hover: #484fac96;
			--placeholder: #63687b;
			--background-2: #292d36;
		}
	}
	@media (prefers-color-scheme: light) {
		.scanny-extension {
			--background: #fafcff;
			--border: #f2f3fb;
			--text: #2b2d41;
			--text-2: #2b2d41;
			--text-3: #929db2;
			--select: #eff3f9;
			--accent: #6068d2;
			--accent-hover: #484fac;
			--placeholder: #bac2d1;
			--background-2: #292d36;
		}
	}

	.scanny-extension {
		font-family: Inter !important;
		z-index: 99999999999;
	}

	::-webkit-scrollbar {
		width: 10px;
		height: 10px;
	}

	::-webkit-scrollbar-thumb {
		background-color: rgba(127, 127, 127, 0.6);
		background-clip: padding-box;
		border: 2px solid transparent;
		border-radius: 5px;
	}

	::-webkit-scrollbar-thumb:vertical:hover,
	::-webkit-scrollbar-thumb:horizontal:hover {
		background-color: rgb(110, 110, 110);
	}

	::-webkit-scrollbar-track {
		background-color: transparent;
	}

	::-webkit-scrollbar-thumb:vertical:active,
	::-webkit-scrollbar-thumb:horizontal:active {
		background-color: rgba(95, 91, 91, 1);
	}

	::-webkit-scrollbar-corner {
		background: none;
	}
`;
