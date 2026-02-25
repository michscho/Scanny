import { css } from "@emotion/react";

export interface FooterProps {
	result: number;
}

export function Footer(resultProps: FooterProps) {
	return (
		<div css={style}>
			<div css={resultStyle}>{resultProps.result} results</div>
			<div id="scanny-arrows">
				Use arrow keys <span css={shortcut}>↑</span>
				<span css={shortcut}>↓</span> to navigate
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

const shortcut = css`
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
