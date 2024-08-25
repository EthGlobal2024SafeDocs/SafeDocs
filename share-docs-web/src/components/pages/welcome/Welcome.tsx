import WelcomeTemplate from '../../templates/WelcomeTemplate/WelcomeTemplate';
import styles from './Welcome.module.css'

const Welcome = () => {
  return (
    <div className={styles.contentWrapper}>
      <WelcomeTemplate />
    </div>
  );
};

export default Welcome;