type IconProps = {
	size?: number;
	className?: string;
	title?: string;
};

const RectangleIcon = ({ size = 22, className, title = 'Square' }: IconProps) => {
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
			<rect width="18" height="18" x="3" y="3" rx="2" />
		</svg>
	);
};

export default RectangleIcon;
