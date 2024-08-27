import clsx from "clsx";
import { Handler } from "../../../shared/types/components";
import styles from './Button.module.css';

type ButtonProps = {
  children?: JSX.Element | string;
  disabled?: boolean;
  onClick?: Handler;
  type?: "button" | "submit" | "reset";
  className?: string;
}

const Button = ({
  children,
  disabled = false,
  onClick,
  type = "button",
  className,
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
      className={clsx(styles.button, className ? className : '')}
      onClick={handleClick}
      disabled={disabled}
      type={type}
    >
      <span>{children}</span>
    </button>
  );
};

export default Button;