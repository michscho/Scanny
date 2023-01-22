import { css } from "@emotion/react";

export interface FooterProps {
	result: number;
}

export function Footer(resultProps: FooterProps): JSX.Element {
	return (
		<div css={style}>
			<div css={resultStyle}>{resultProps.result} results</div>
			<div id="omni-arrows">
				Use arrow keys <span className="omni-shortcut">↑</span>
				<span className="omni-shortcut">↓</span> to navigate
			</div>
		</div>
	);
}

const style = css`
	height: 45px;
	line-height: 45px;
	border-top: 1px solid #35373e;
	width: 92%;
	margin-left: auto;
	margin-right: auto;
`;

const resultStyle = css`
	color: #a5a5ae;
	font-size: 12px;
	font-weight: 500;
	float: left;
`;
