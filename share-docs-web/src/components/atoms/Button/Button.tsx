import clsx from "clsx";
import { Handler } from "../../../shared/types/components";
import styles from './Button.module.css';

type ButtonProps = {
  children?: JSX.Element | string;
  disabled?: boolean;
  onClick?: Handler;
}

const Button = ({
  children,
  disabled,
  onClick,
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
      className={clsx(styles.button, 'dddd')}
      onClick={handleClick}
    >
      <span>{children}</span>
    </button>
  );
};

export default Button;