import { Formik, Form, FormikProps } from 'formik';
import * as Yup from 'yup';
import styles from './SignupForm.module.css';
import { Handler } from '../../../shared/types/components';
import Button from '../../atoms/Button/Button';
import InputText from '../../molecules/InputText/InputText';
import Title from '../../atoms/Title/Title';

const SignupSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  email: Yup.string()
    .email('Invalid email')
    .required('Email is required'),
  // pin: Yup.string().length(6).required('Pin is required'),
  // pinConfirm: Yup.string().length(6).required('Confirming Pin is required')
  //   // .test('pin-match', 'Pin must match', function(value) {
  //   //   return this.parent.pin === value
  //   // })
  //   .oneOf([Yup.ref('pin')], 'Pin must match')
});

export interface SignupValues {
  username: string;
  email: string;
  // pin: string;
  // pinConfirm: string;
}

type SignupFormProps = {
  onSubmit?: Handler<SignupValues>;
  onCancel?: Handler;
}

const SignupForm = ({ onSubmit, onCancel }: SignupFormProps) => {
  return (
    <div className={styles.signupFormWrapper}>
      <Title label="SignUp" tag="h2" />
      <Formik
        initialValues={{
          username: '',
          email: '',
          pin: '',
          pinConfirm: '',
        }}
        validationSchema={SignupSchema}
        onSubmit={(
          values: SignupValues,
        ) => {
          onSubmit?.(values);
        }}
      >
       {(props: FormikProps<SignupValues>) => (
          <Form className={styles.signupForm}>
            <InputText
              ariaLabel="Username"
              name="username"
              placeholder="Username"
              type="text"
              label="Username:"
            />
            <InputText
              ariaLabel="Email"
              name="email"
              placeholder="Email"
              type="email"
              label="Email:"
            />
            {/* <InputText
              ariaLabel="Pin"
              name="pin"
              placeholder="******"
              type="password"
              label="Pin:"
            />
            <InputText
              ariaLabel="Re-Enter Pin"
              name="pinConfirm"
              placeholder="******"
              type="password"
              label="Re-Enter Pin:"
            /> */}
            <div className={styles.buttons}>
              <Button type="submit">SignUp</Button>
              <Button type="button" onClick={() => onCancel?.()}>Cancel</Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SignupForm;
