import { css } from "@emotion/react";

export interface FooterProps {
	result: number;
	onOpenSettings: () => void;
}

export function Footer(resultProps: FooterProps) {
	return (
		<div css={style}>
			<div css={resultStyle}>{resultProps.result} results</div>
			<div css={rightSection}>
				<div id="scanny-arrows">
					Use arrow keys <span css={footerShortcut}>↑</span>
					<span css={footerShortcut}>↓</span> to navigate
				</div>
				<button type="button" css={settingsButton} onClick={resultProps.onOpenSettings}>
					Settings
				</button>
			</div>
		</div>
	);
}

const style = css`
	height: 46px;
	line-height: 46px;
	border-top: 1px solid var(--border);
	width: 92%;
	margin-left: auto;
	margin-right: auto;
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

const resultStyle = css`
	color: var(--text-3);
	font-size: 12px;
	font-weight: 600;
`;

const rightSection = css`
	display: flex;
	align-items: center;
	gap: 10px;
`;

const footerShortcut = css`
	display: inline-block !important;
	font-size: 12px;
	font-weight: 600;
	border-radius: 5px;
	background-color: var(--chip-bg);
	color: var(--chip-text);
	text-align: center;
	height: 21px;
	line-height: 21px;
	min-width: 22px;
	padding-left: 5px;
	padding-right: 5px;
`;

const settingsButton = css`
	border: 1px solid var(--border);
	background: color-mix(in srgb, var(--background-solid) 90%, white 10%);
	color: var(--text-2);
	font-size: 12px;
	font-weight: 600;
	border-radius: 8px;
	padding: 5px 10px;
	line-height: 1;
	cursor: pointer;
	transition: border-color 0.15s ease, color 0.15s ease, background 0.15s ease;

	:hover {
		border-color: color-mix(in srgb, var(--accent) 45%, var(--border));
		color: var(--text);
	}
`;
