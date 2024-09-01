import { Formik, Form, FormikProps } from 'formik';
import * as Yup from 'yup';
import Title from '../../atoms/Title/Title';
import styles from './DocumentAdd.module.css';
// import InputText from '../../molecules/InputText/InputText';
import Button from '../../atoms/Button/Button';
import { Handler } from '../../../shared/types/components';
import InputTextArea from '../../molecules/InputTextArea/InputTextArea';

const DocumentAddSchema = Yup.object().shape({
  payload: Yup.string()
    .min(10, 'Please provide a valid document details')
    .required('Document detail is required'),
});

export interface DocumentAddValues {
  payload: string;
}

type DocumentAddProps = {
  onAdd?: (payload: string) => void;
  onCancel?: Handler;
}

const DocumentAdd = ({ onAdd, onCancel }: DocumentAddProps) => {
  return (
    <div className={styles.contentWrapper}>
      <Title label='Add document for sharing' tag='h4' />
      <Title className={styles.title} label='Document details' tag='h5' />
      <Formik
        initialValues={{
          payload: '',
        }}
        validationSchema={DocumentAddSchema}
        onSubmit={(
          values: DocumentAddValues,
        ) => {
          onAdd?.(values.payload);
        }}
      >
       {(props: FormikProps<DocumentAddValues>) => (
          <Form className={styles.documentContent}>
            <InputTextArea 
              ariaLabel="Document details"
              name="payload"
              placeholder="Document details"
              label="Document json:"
              labelClassName={styles.label}
            />
            {/* <InputText
              ariaLabel="Document details"
              name="payload"
              placeholder="Document details"
              type="string"
              label="Document details:"
              labelClassName={styles.label}
            /> */}
            <div className={styles.buttons}>
              <Button type="submit">Add</Button>
              <Button type="button" onClick={() => onCancel?.()}>Cancel</Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default DocumentAdd;
