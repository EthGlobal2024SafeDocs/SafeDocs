import DocumentTemplate from '../../templates/DocumentTemplate/DocumentTemplate';
import styles from './Document.module.css';

const Document = () => {
  return (
    <div className={styles.contentWrapper}>
      <DocumentTemplate />
    </div>
  )
};

export default Document;
