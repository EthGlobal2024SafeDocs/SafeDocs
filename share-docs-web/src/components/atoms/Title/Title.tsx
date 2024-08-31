import clsx from 'clsx';
import styles from './Title.module.css'

type TitleProps = {
  label: string;
  labelBold?: string;
  fontWeight?: 'light';
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  className?: string;
}

const Title = ({
  label,
  labelBold,
  fontWeight,
  tag = 'h1',
  className,
}: TitleProps) => {
  const Tag = tag;
  return (
    <Tag className={clsx(styles.title, className ? className : '', fontWeight ? styles[fontWeight] : '')}>
      {label}
      {labelBold ? <b><i>{labelBold}</i></b> : ''}
    </Tag>
  );
};

export default Title;