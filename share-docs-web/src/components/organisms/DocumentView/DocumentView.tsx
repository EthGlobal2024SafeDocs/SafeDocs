import Title from '../../atoms/Title/Title';
import styles from './DocumentView.module.css';
import Button from '../../atoms/Button/Button';
import { Handler } from '../../../shared/types/components';
import InputTextArea from '../../molecules/InputTextArea/InputTextArea';
import { Form, Formik } from 'formik';

type DocumentViewProps = {
  document?: string;
  onCancel?: Handler;
}

const DocumentView = ({ document, onCancel }: DocumentViewProps) => {
  console.log('selected document = ', document);
  return (
    <div className={styles.contentWrapper}>
      <Title label='View document for sharing' tag='h4' />
      <Title className={styles.title} label='Document details' tag='h5' />
      <Formik
        initialValues={{
          payload: document ?? '',
        }}
        onSubmit={() => { 
          // do nothing
        }}
      >
        <Form className={styles.documentContent}>
            <InputTextArea 
              ariaLabel="Document details"
              name="payload"
              placeholder="Document details"
              label="Document json:"
              labelClassName={styles.label}
              value={document}
              disabled
            />
            <div className={styles.buttons}>
              <Button type="button" onClick={() => onCancel?.()}>Back</Button>
            </div>
          </Form>
        </Formik>
    </div>
  );
};

export default DocumentView;
