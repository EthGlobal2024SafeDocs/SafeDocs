import Document from "../../../models/api/document";
import Button from "../../atoms/Button/Button";

import styles from './DocumentItem.module.css';

type DocumentItemProps = {
  item: Document;
  buttonLabel?: string;
  onClick?: () => void;
}

const DocumentItem = ({
  item,
  onClick,
  buttonLabel = ''
}: DocumentItemProps) => {
  const handleOnClick = () => {
    onClick?.();
  }
  return (
    <li className={styles.item} >
      <h6>{item.document_type}</h6>
      {onClick && <Button onClick={handleOnClick}>{buttonLabel}</Button>}
    </li>
  )
};

export default DocumentItem;
