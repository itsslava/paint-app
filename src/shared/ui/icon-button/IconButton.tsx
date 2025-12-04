import clsx from 'clsx';
import styles from './icon-button.module.scss';
import type { ReactNode } from 'react';

type IconButtonProps = {
	label: string;
	active?: boolean;
	disabled?: boolean;
	onClick?: () => void;
	children: ReactNode;
	className?: string;
};

const IconButton = ({
	label,
	active = false,
	disabled = false,
	onClick,
	children,
	className,
}: IconButtonProps) => {
	return (
		<button
			type="button"
			aria-label={label}
			aria-pressed={active ? true : undefined}
			data-active={active}
			disabled={disabled}
			className={clsx(styles.btn, className)}
			onClick={onClick}
		>
			{children}
		</button>
	);
};

export default IconButton;
