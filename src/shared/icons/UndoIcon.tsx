type IconProps = {
	size?: number;
	className?: string;
	title?: string;
};

const UndoIcon = ({ size = 20, className, title = 'Undo' }: IconProps) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
			role="img"
			aria-hidden={title ? undefined : true}
			className={className}
		>
			{title ? <title>{title}</title> : null}
			<path d="M9 14 4 9l5-5" />
			<path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11" />
		</svg>
	);
};

export default UndoIcon;
