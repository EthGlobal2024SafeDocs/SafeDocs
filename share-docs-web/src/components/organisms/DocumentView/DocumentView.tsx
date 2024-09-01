import Title from '../../atoms/Title/Title';
import styles from './DocumentView.module.css';
// import InputText from '../../molecules/InputText/InputText';
import Button from '../../atoms/Button/Button';
import { Handler } from '../../../shared/types/components';
import InputTextArea from '../../molecules/InputTextArea/InputTextArea';

type DocumentAddProps = {
  document?: string;
  onCancel?: Handler;
}

const DocumentAdd = ({ document, onCancel }: DocumentAddProps) => {
  return (
    <div className={styles.contentWrapper}>
      <Title label='Add document for sharing' tag='h4' />
      <Title className={styles.title} label='Document details' tag='h5' />
      <div className={styles.documentContent}>
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
      </div>
    </div>
  );
};

export default DocumentAdd;
