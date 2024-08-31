import { Handler } from '../../../shared/types/components';
import Button from '../../atoms/Button/Button';
import Title from '../../atoms/Title/Title';
import styles from './UserContent.module.css';
import Document from '../../../models/api/document';
import DocumentList from '../DocumentList/DocumentList';
import DocumentItem from '../DocumentItem/DocumentItem';
import { useDocumentStore } from "../../../store/useDocumentStore";

type UserContentProps = {
  myDocuments?: Document[];
  sharedDocuments?: Document[];
  onClick?: Handler;
  onCancel?: Handler;
}

const UserContent = ({ myDocuments = [], sharedDocuments = [], onClick, onCancel }: UserContentProps) => {
  const { setSelectedDocument, setSelectedSharedDocument: setSelectedSharedDocuments } = useDocumentStore();
  const documentList = myDocuments?.map((document, index) => {
    const onClick = () => {
      setSelectedDocument(document);
    };
    return <DocumentItem key={`my-document${index}`} item={document} buttonLabel='Share' onClick={onClick} />;
  });
  const sharedDocumentList = sharedDocuments?.map((document, index) => {
    const onClick = () => {
      setSelectedSharedDocuments(document);
    };
    return <DocumentItem key={`shared-document${index}`} item={document} buttonLabel='View' onClick={onClick} />
  });
  return (
    <div className={styles.contentWrapper}>
      <Title label='My shares' tag='h4' />
      {myDocuments.length > 0 ? <DocumentList>{documentList}</DocumentList> : null}
      <div className={styles.buttons}>
        <Button type="button" onClick={() => onClick?.()}>Add Share</Button>
      </div>
      <Title label='Accepted shares' tag='h4' />
      {sharedDocuments.length > 0 ? <DocumentList>{sharedDocumentList}</DocumentList> : null}
    </div>
  );
};

export default UserContent;
