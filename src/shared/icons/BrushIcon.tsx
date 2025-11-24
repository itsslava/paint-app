type IconProps = {
	size?: number;
	className?: string;
	title?: string;
};

const BrushIcon = ({ size = 20, className, title = 'Brush' }: IconProps) => {
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
			<path d="m11 10 3 3" />
			<path d="M6.5 21A3.5 3.5 0 1 0 3 17.5a2.62 2.62 0 0 1-.708 1.792A1 1 0 0 0 3 21z" />
			<path d="M9.969 17.031 21.378 5.624a1 1 0 0 0-3.002-3.002L6.967 14.031" />
		</svg>
	);
};

export default BrushIcon;
