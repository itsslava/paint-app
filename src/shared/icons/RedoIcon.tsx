type IconProps = {
	size?: number;
	className?: string;
	title?: string;
};

const RedoIcon = ({ size = 20, className, title = 'Redo' }: IconProps) => {
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
			<path d="m15 14 5-5-5-5" />
			<path d="M20 9H9.5A5.5 5.5 0 0 0 4 14.5A5.5 5.5 0 0 0 9.5 20H13" />
		</svg>
	);
};

export default RedoIcon;
