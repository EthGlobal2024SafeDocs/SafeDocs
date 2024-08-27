import { Formik, Form, FormikProps } from 'formik';
import * as Yup from 'yup';
import styles from './LoginForm.module.css';
import { Handler } from '../../../shared/types/components';
import Button from '../../atoms/Button/Button';
import InputText from '../../molecules/InputText/InputText';
import Title from '../../atoms/Title/Title';

const LoginSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  pin: Yup.string().length(6).required('Pin is required')
});

export interface LoginValues {
  username: string;
  pin: string;
}

type SignupFormProps = {
  onSubmit?: Handler<LoginValues>;
  onCancel?: Handler;
}

const SignupForm = ({ onSubmit, onCancel }: SignupFormProps) => {
  return (
    <div className={styles.loginFormWrapper}>
      <Title label="Login" tag="h2" />
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
