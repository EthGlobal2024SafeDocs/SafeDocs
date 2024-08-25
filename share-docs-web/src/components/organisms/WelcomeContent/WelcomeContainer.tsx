import Button from "../../atoms/Button/Button"
import Title from "../../atoms/title/Title"
import styles from './WelcomeContainer.module.css'

const WelcomeContainer = () => {
  return (
    <div className={styles.contentWrapper}>
      <Title label="Welcome" />
      <div className={styles.buttons}>
        <Button>Login</Button> Or <Button>SignUp</Button>
      </div>
    </div>
  );
};

export default WelcomeContainer;