import { Formik, Form, FormikProps } from 'formik';
import * as Yup from 'yup';
import Title from '../../atoms/Title/Title';
import styles from './DocumentShare.module.css';
import InputText from '../../molecules/InputText/InputText';
import Button from '../../atoms/Button/Button';
import { Handler } from '../../../shared/types/components';
import { User } from '../../../models/user';
import Document from '../../../models/api/document';
import LabelText from '../../molecules/LabelText/LabelText';
import DateTimePicker from '../DateTimePicker/DateTimePicker';
import dayjs from 'dayjs';

const DocumentShareSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email')
    .required('Email is required'),
  expiresOn: Yup.mixed<dayjs.Dayjs>()
    .nullable()
    .required('Expires on is required'),
});

export interface DocumentShareValues {
  email: string;
  expiresOn: dayjs.Dayjs | null;
}

type DocumentShareProps = {
  document: Document;
  user: User;
  onShare?: (email: string, expires: dayjs.Dayjs | null) => void;
  onCancel?: Handler;
}

const DocumentShare = ({ document, user, onShare, onCancel }: DocumentShareProps) => {
  return (
    <div className={styles.contentWrapper}>
      <Title label='Ready to share' labelBold={user.username} tag='h4' />
      <Title className={styles.title} label='Document' tag='h5' />
      <Formik
        initialValues={{
          documentId: '',
          email: '',
          expiresOn: dayjs(),
        }}
        validationSchema={DocumentShareSchema}
        onSubmit={(
          values: DocumentShareValues,
        ) => {
          onShare?.(values.email, values.expiresOn);
        }}
      >
       {(props: FormikProps<DocumentShareValues>) => (
          <Form className={styles.documentContent}>
            <LabelText
              labelClassName={styles.label}
              label='Document Id:'
              text={document?._id?.toString() || 'MyDriverLicenceID.12121212'}
            />
            <InputText
              ariaLabel="Recipient email"
              name="email"
              placeholder="Email"
              type="email"
              label="Recipient email:"
              labelClassName={styles.label}
            />
            <DateTimePicker name="expiresOn" />
            <div className={styles.buttons}>
              <Button type="submit">Share</Button>
              <Button type="button" onClick={() => onCancel?.()}>Cancel</Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default DocumentShare;
