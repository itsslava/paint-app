type IconProps = {
	size?: number;
	className?: string;
	title?: string;
};

const CircleIcon = ({ size = 20, className, title = 'Circle' }: IconProps) => {
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
			<circle cx="12" cy="12" r="10" />
		</svg>
	);
};

export default CircleIcon;
