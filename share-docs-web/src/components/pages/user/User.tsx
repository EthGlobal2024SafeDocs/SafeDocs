import UserTemplate from "../../templates/UserTemplate/UserTemplate";
import styles from './User.module.css';

const User = () => {
  return (
    <div className={styles.contentWrapper}>
      <UserTemplate />
    </div>
  );
};

export default User;