import Document from "../../../models/api/document";
import Button from "../../atoms/Button/Button";

import styles from './DocumentItem.module.css';

type DocumentItemProps = {
  item: Document;
  buttonLabel?: string;
  viewButtonLabel?: string;
  onClick?: () => void;
  onView?: () => void;
}

const DocumentItem = ({
  item,
  onClick,
  onView,
  buttonLabel = '',
  viewButtonLabel = '',
}: DocumentItemProps) => {
  const handleOnClick = () => {
    onClick?.();
  }
  return (
    <li className={styles.item} >
      <h6>{item.document_type}</h6>
      {onClick && (
        <div className={styles.buttons}>
          <Button variant='secondary' onClick={handleOnClick}>{buttonLabel}</Button>
          {onView && <Button variant='secondary' onClick={onView}>{viewButtonLabel}</Button>}
        </div>
      )}
    </li>
  )
};

export default DocumentItem;
