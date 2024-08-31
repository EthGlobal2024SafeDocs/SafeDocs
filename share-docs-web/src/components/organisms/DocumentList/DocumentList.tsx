import styles from './DocumentList.module.css';

type DocumentListProps = {
  children?: JSX.Element | JSX.Element[] | string;
};

const DocumentList = ({ children }: DocumentListProps) => {
  return <ul className={styles.itemList}>{children}</ul>;
};

export default DocumentList;
