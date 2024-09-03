import clsx from "clsx";
import { useField  } from 'formik';
import styles from './InputTextArea.module.css';

type InputTextAreaProps = {
  label: string;
  name: string;
  ariaLabel: string;
  placeholder: string;
  labelClassName?: string;
  disabled?: boolean;
  value?: string | undefined;
}

const InputTextArea = ({
  label,
  name,
  ariaLabel,
  placeholder,
  labelClassName = '',
  disabled,
}: InputTextAreaProps) => {
  const [field, meta] = useField(name);
  return (
    <div className={styles.inputWrapper}>
      <span className={clsx(styles.label, labelClassName)}>{label}</span>
      <textarea
        {...field}
        aria-label={ariaLabel}
        name={field.name}
        rows={6}
        cols={50}
        placeholder={placeholder}
        className={styles.inputText}
        disabled={disabled}
      />
      {meta.touched && meta.error ? (
        <div className={styles.errorMessage}>{meta.error}</div>
      ) : null}
    </div>
  );
};


export default InputTextArea;
