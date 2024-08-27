import { useState } from "react";
import WelcomeContainer from "../../organisms/WelcomeContent/WelcomeContainer"
import { PageType } from "../../../shared/types/components";
import SignupForm, { SignupValues } from "../../organisms/SignupForm/SignupForm";
import LoginForm, { LoginValues } from "../../organisms/LoginForm/LoginForm";

const WelcomeTemplate = () => {
  const [pageType, setPageType] = useState<PageType>(PageType.Welcome);
  
  const loginClick = () => {
    setPageType(PageType.Login);
  };

  const signUpClick = () => {
    setPageType(PageType.SignUp);
  }

  const onSignUp = (data: SignupValues | undefined) => {
    // TODO need to call some services
    console.log('data submitted = ', data);
  }

  const onLogin = (data: LoginValues | undefined) => {
    // TODO need to call some services
    console.log('data login: ', data);
  }

  const onCancel = () => {
    setPageType(PageType.Welcome);
  }

  return (
    <>
      {pageType === PageType.Welcome && <WelcomeContainer pageType={pageType} onLoginClick={loginClick} onSignUpClick={signUpClick} />}
      {pageType === PageType.Login && <LoginForm onSubmit={onLogin} onCancel={onCancel} />}
      {pageType === PageType.SignUp && <SignupForm onSubmit={onSignUp} onCancel={onCancel}/>}
    </>
  );
};

export default WelcomeTemplate;