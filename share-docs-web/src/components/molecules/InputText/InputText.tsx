import { useField  } from 'formik';

import styles from './InputText.module.css';

type InputTextProps = {
  label: string;
  name: string;
  ariaLabel: string;
  type?: string;
  placeholder: string;
}

const InputText = ({
  label,
  name,
  ariaLabel,
  type,
  placeholder,
}: InputTextProps) => {
  const [field, meta] = useField(name);
  return (
    <div className={styles.inputWrapper}>
      <span className={styles.label}>{label}</span>
      <input
        {...field}
        aria-label={ariaLabel}
        name={field.name}
        type={type}
        placeholder={placeholder}
        className={styles.inputText}
      />
      {meta.touched && meta.error ? (
        <div className={styles.errorMessage}>{meta.error}</div>
      ) : null}
    </div>
  );
};


export default InputText;
