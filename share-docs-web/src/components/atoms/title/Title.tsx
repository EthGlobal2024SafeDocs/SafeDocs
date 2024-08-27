import clsx from 'clsx';
import styles from './Title.module.css'

type TitleProps = {
  label: string;
  labelBold?: string;
  tag?: 'h1' | 'h2' | 'h4';
  className?: string;
}

const Title = ({
  label,
  labelBold,
  tag = 'h1',
  className,
}: TitleProps) => {
  const Tag = tag;
  return (
    <Tag className={clsx(styles.title, className ? className : '')}>
      {label}
      {labelBold ? <b><i>{labelBold}</i></b> : ''}
    </Tag>
  );
};

export default Title;