import styles from './Title.module.css'

type TitleProps = {
  label: string;
  labelBold?: string;
  tag?: 'h1' | 'h2' | 'h4';
}

const Title = ({
  label,
  labelBold,
  tag = 'h1',
}: TitleProps) => {
  const Tag = tag;
  return (
    <Tag className={styles.title}>
      {label}
      {labelBold ? <b><i>{labelBold}</i></b> : ''}
    </Tag>
  );
};

export default Title;