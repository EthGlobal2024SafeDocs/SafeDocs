import clsx from "clsx";
import { Handler } from "../../../shared/types/components";
import styles from './Button.module.css';

type ButtonProps = {
  children?: JSX.Element | string;
  disabled?: boolean;
  onClick?: Handler;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary'
  className?: string;
}

const Button = ({
  children,
  disabled = false,
  onClick,
  type = "button",
  className,
  variant,
}: ButtonProps) => {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      onClick?.();
    } else {
      event.preventDefault();
    }
  }
  return (
    <button
      className={
        clsx(
          styles.button,
          className ? className : '',
          variant ? styles[variant] : '',
        )}
      onClick={handleClick}
      disabled={disabled}
      type={type}
    >
      <span>{children}</span>
    </button>
  );
};

export default Button;