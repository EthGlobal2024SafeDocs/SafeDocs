import { Handler, PageType } from "../../../shared/types/components";
import Button from "../../atoms/Button/Button"
import Title from "../../atoms/Title/Title"
import styles from './WelcomeContainer.module.css'

type WelcomeContainerProps = {
  pageType?: PageType;
  onLoginClick?: Handler;
  onSignUpClick?: Handler;
}

const WelcomeContainer = ({
  pageType = PageType.Welcome,
  onLoginClick,
  onSignUpClick,
}: WelcomeContainerProps) => {
  const handleLoginClick = () => {
    onLoginClick?.();
  };

  const handleSignUpClick = () => {
    onSignUpClick?.();
  }
  const titleBold = PageType.Login === pageType ? "back" : "";

  return (
    <div className={styles.contentWrapper}>
      <Title label="Welcome" labelBold={titleBold} />
      <div className={styles.buttons}>
        <Button
          disabled={PageType.Welcome !== pageType}
          onClick={handleLoginClick}
        >
          Login
        </Button>
        Or
        <Button
          disabled={PageType.Welcome !== pageType}
          onClick={handleSignUpClick}
        >
          SignUp
        </Button>
      </div>
    </div>
  );
};

export default WelcomeContainer;