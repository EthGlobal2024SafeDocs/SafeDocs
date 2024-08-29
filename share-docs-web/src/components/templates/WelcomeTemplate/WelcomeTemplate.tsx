import { useState } from "react";
import WelcomeContainer from "../../organisms/WelcomeContent/WelcomeContainer"
import { PageType } from "../../../shared/types/components";
import SignupForm, { SignupValues } from "../../organisms/SignupForm/SignupForm";
import LoginForm, { LoginValues } from "../../organisms/LoginForm/LoginForm";
import { signupUser } from "../../../services/signupService";
import { User } from "../../../models/user";
import DialogModal from '../../organisms/DialogModal/DialogModal';

const WelcomeTemplate = () => {
  const [pageType, setPageType] = useState<PageType>(PageType.Welcome);
  const [isOpen, setIsOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState<string | undefined>();
  const [dialogText, setDialogText] = useState<string>('');
  
  const loginClick = () => {
    setPageType(PageType.Login);
  };

  const signUpClick = () => {
    setPageType(PageType.SignUp);
  }

  const onSignUp = async (data: SignupValues | undefined) => {
    // TODO need to call some services
    if (data?.username === undefined || data?.email === undefined) {
      return;
    }
    const user: User = {
      username: data.username,
      email: data.email,
      signature: 'signature',
      sk_acc: 'sadsadasd',
      pkey: 'public_key',
    };
    const result = await signupUser(user);
    if (!result) {
      setDialogTitle('Signup Form');
      setDialogText('Email or username already exists. Please try again.');
      setIsOpen(true);
    }
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
      <DialogModal text={dialogText} title={dialogTitle} isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default WelcomeTemplate;