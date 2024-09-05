import { DocumentPageType, Handler } from '../../../shared/types/components';
import Button from '../../atoms/Button/Button';
import Title from '../../atoms/Title/Title';
import styles from './UserContent.module.css';
import Document from '../../../models/api/document';
import DocumentList from '../DocumentList/DocumentList';
import DocumentItem from '../DocumentItem/DocumentItem';

type UserContentProps = {
  myDocuments?: Document[];
  sharedDocuments?: Document[];
  onClick?: (documentPageType: DocumentPageType, document?: Document) => void;
  onView?: (document?: Document) => void;
  onCancel?: Handler;
}

const UserContent = ({ myDocuments = [], sharedDocuments = [], onClick, onView }: UserContentProps) => {
  const documentList = myDocuments?.map((document, index) => {
    const clickHandler = () => {
      onClick?.(DocumentPageType.Share, document);
    };
    const clickViewHandler = () => {
      onView?.(document);
    };
    return (
      <>
        {onView
          ? <DocumentItem
              key={`my-document${index}`}
              item={document}
              buttonLabel='Share'
              viewButtonLabel='View'
              onClick={clickHandler}
              onView={clickViewHandler}
            />
          : <DocumentItem
              key={`my-document${index}`}
              item={document}
              buttonLabel='Share'
              onClick={clickHandler}
            />
        }
      </>
    );
  });

  const sharedDocumentList = sharedDocuments?.map((document, index) => {
    const clickHandler = () => {
      onClick?.(DocumentPageType.View, document);
    };
    return <DocumentItem key={`shared-document${index}`} item={document} buttonLabel='View' onClick={clickHandler} />
  });

  return (
    <div className={styles.contentWrapper}>
      <div className={styles.userDocuments}>
        <Title label='My shares' tag='h4' />
        {myDocuments.length > 0 ? <DocumentList>{documentList}</DocumentList> : null}
        <div className={styles.buttons}>
          <Button type="button" onClick={() => onClick?.(DocumentPageType.Add)}>Add Document</Button>
        </div>
      </div>
      <Title label='Accepted shares' tag='h4' />
      {sharedDocuments.length > 0 ? <DocumentList>{sharedDocumentList}</DocumentList> : null}
    </div>
  );
};

export default UserContent;
