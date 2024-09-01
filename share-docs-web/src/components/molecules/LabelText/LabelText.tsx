import Title from "../../atoms/Title/Title";
import styles from './LabelText.module.css';

type LabelTextProps = {
  label?: string;
  text?: string;
}

const LabelText = ({ label = '', text }: LabelTextProps) => {
  return (
    <div className={styles.wrapper}>
      <Title fontWeight="light" label={label} tag="h5" className={styles.label} />
      <span className={styles.text}>{text}</span>
    </div>
  );
};

export default LabelText;
