import styles from './Title.module.css'

type TitleProps = {
  label: string;
  text?: string;
}

const Title = ({
  label,
  text,
}: TitleProps) => {
  return (
    <h2 className={styles.title}>
      {label}
      {text ? `<b><i>${text}</i></b>` : ''}
    </h2>
  );
};

export default Title;