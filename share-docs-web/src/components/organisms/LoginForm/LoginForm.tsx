import { Formik, Form, FormikProps, useField } from 'formik';
import * as Yup from 'yup';
import styles from './LoginForm.module.css';
import { Handler } from '../../../shared/types/components';
import Button from '../../atoms/Button/Button';

const LoginSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  pin: Yup.string().length(6).required('Pin is required')
});

export interface LoginValues {
  username: string;
  pin: string;
}

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

type SignupFormProps = {
  onSubmit?: Handler<LoginValues>;
  onCancel?: Handler;
}

const SignupForm = ({ onSubmit, onCancel }: SignupFormProps) => {
  return (
    <div className={styles.loginFormWrapper}>
      <h2>SignUp</h2>
      <Formik
        initialValues={{
          username: '',
          pin: '',
        }}
        validationSchema={LoginSchema}
        onSubmit={(
          values: LoginValues,
        ) => {
          onSubmit?.(values);
        }}
      >
       {(props: FormikProps<LoginValues>) => (
          <Form className={styles.loginForm}>
            <InputText
              ariaLabel="Username"
              name="username"
              placeholder="Username"
              type="text"
              label="Username:"
            />
            <InputText
              ariaLabel="Pin"
              name="pin"
              placeholder="******"
              type="password"
              label="Pin:"
            />
            <div className={styles.buttons}>
              <Button type="submit">Login</Button>
              <Button type="button" onClick={() => onCancel?.()}>Cancel</Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SignupForm;
