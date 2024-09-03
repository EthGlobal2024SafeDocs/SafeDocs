import clsx from "clsx";
import Title from "../../atoms/Title/Title";
import styles from './LabelText.module.css';

type LabelTextProps = {
  label?: string;
  text?: string;
  labelClassName?: string
}

const LabelText = ({ label = '', text, labelClassName = '' }: LabelTextProps) => {
  return (
    <div className={styles.wrapper}>
      <Title fontWeight="light" label={label} tag="h5" className={clsx(styles.label, labelClassName)} />
      <span className={styles.text}>{text}</span>
    </div>
  );
};

export default LabelText;
