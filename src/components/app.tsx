import "../../public/content.css";
import { Action } from "../actions/data/types-data";
import { css, Global } from "@emotion/react";
import { SearchApp } from "./search-app";
import React, { useEffect } from "react";

export interface AppProps {
	actions: Action[];
	onClose?: () => void;
}

type Status = "open" | "closed";

export function App(searchProps: AppProps): JSX.Element {
	const [status, setStatus] = React.useState<Status>("open");

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				setStatus("closed");
			}
		};
		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, []);

	useEffect(() => {
		if (status === "closed") {
			searchProps.onClose?.();
		}
	}, [searchProps.onClose, status]);

	if (status === "closed") return <></>;
	return (
		<div>
			<div id="scanny-extension" className="scanny-extension">
				<SearchApp actions={searchProps.actions} setStatus={setStatus} />
			</div>
			<Global styles={globalStyle} />
		</div>
	);
}

const globalStyle = css`
	@media (prefers-color-scheme: dark) {
		.scanny-extension {
			--background: rgba(16, 21, 29, 0.88);
			--background-solid: #10151d;
			--border: #2a313d;
			--text: #f4f7fb;
			--text-2: #d7dee8;
			--text-3: #95a3b7;
			--select: #182331;
			--select-soft: rgba(33, 49, 70, 0.55);
			--accent: #3ba6ff;
			--accent-hover: #5cb7ff;
			--placeholder: #74859d;
			--chip-bg: #253244;
			--chip-text: #e6f0ff;
			--shadow: 0 22px 70px rgba(0, 0, 0, 0.46);
		}
	}
	@media (prefers-color-scheme: light) {
		.scanny-extension {
			--background: rgba(247, 251, 255, 0.95);
			--background-solid: #f7fbff;
			--border: #d5e1ee;
			--text: #16263a;
			--text-2: #273a52;
			--text-3: #5d728e;
			--select: #e4f0fb;
			--select-soft: rgba(211, 231, 249, 0.5);
			--accent: #0f80d4;
			--accent-hover: #005f9f;
			--placeholder: #7b92ae;
			--chip-bg: #d8e8f8;
			--chip-text: #1e3550;
			--shadow: 0 20px 65px rgba(16, 34, 57, 0.25);
		}
	}

	.scanny-extension {
		font-family: "Inter", "Avenir Next", "Segoe UI", sans-serif !important;
		z-index: 99999999999;
		letter-spacing: 0.01em;
	}

	.scanny-extension ::-webkit-scrollbar {
		width: 10px;
		height: 10px;
	}

	.scanny-extension ::-webkit-scrollbar-thumb {
		background-color: rgba(87, 113, 145, 0.75);
		background-clip: padding-box;
		border: 2px solid transparent;
		border-radius: 5px;
	}

	.scanny-extension ::-webkit-scrollbar-thumb:vertical:hover,
	.scanny-extension::-webkit-scrollbar-thumb:horizontal:hover {
		background-color: rgb(105, 134, 169);
	}

	.scanny-extension ::-webkit-scrollbar-track {
		background-color: transparent;
	}

	.scanny-extension ::-webkit-scrollbar-thumb:vertical:active,
	.scanny-extension ::-webkit-scrollbar-thumb:horizontal:active {
		background-color: rgba(88, 114, 148, 1);
	}

	.scanny-extension ::-webkit-scrollbar-corner {
		background: none;
	}

	@media (prefers-reduced-motion: reduce) {
		.scanny-extension * {
			transition: none !important;
			animation: none !important;
		}
	}
`;
