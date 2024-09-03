import { useContext, useState } from "react";
import { useNavigate } from 'react-router-dom';
import WelcomeContainer from "../../organisms/WelcomeContent/WelcomeContainer"
import { PageType } from "../../../shared/types/components";
import SignupForm, { SignupValues } from "../../organisms/SignupForm/SignupForm";
import LoginForm, { LoginValues } from "../../organisms/LoginForm/LoginForm";
import { createUser, userExists } from "../../../services/registerService";
import { User } from "../../../models/user";
import DialogModal from '../../organisms/DialogModal/DialogModal';
import { useAppStore } from "../../../store/useAppStore";
import { AuthContext } from "../../../context/AuthContext";
import { loginUser } from "../../../services/loginService";

const WelcomeTemplate = () => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const { setAuthenticated, setUser } = useAppStore();
  const [pageType, setPageType] = useState<PageType>(PageType.Welcome);
  const [isOpen, setIsOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState<string | undefined>();
  const [dialogText, setDialogText] = useState<string>('');
  
  const grantAccess = (user: User) => {
    setUser(user);
    setAuthenticated(true);
    navigate('/user');
  }

  const loginClick = () => {
    setPageType(PageType.Login);
  };

  const signUpClick = () => {
    setPageType(PageType.SignUp);
  }

  const showDialog = (title: string, message: string) => {
    setDialogTitle(title);
    setDialogText(message);
    setIsOpen(true);
  }

  const checkIfUserExists = async (email: string, username: string) => {
    const exists = await userExists(email, username);
    if (exists) {
      showDialog('Signup Form', 'Email or username already exists. Please try again.');
      return true;
    }
    return false;
  }

  const onSignUp = async (data: SignupValues | undefined) => {
    if (data?.username === undefined || data?.email === undefined) {
      return;
    }
    const useExists: boolean = await checkIfUserExists(data.email, data.username);
    if (useExists) {
      return;
    }
    const user: User = {
      username: data.username,
      email: data.email,
    };
    const result = await createUser(user);
    if (!result) {
      showDialog('Signup Form', 'Could not create a user. Please try again.');
    } else {
      grantAccess(user);
    }
  }

  const onLogin = async (data: LoginValues | undefined) => {
    if (!data?.username) {
      return;
    }
    const loginResult = await loginUser(data.username);
    if (!loginResult?.response.token) {
      return;
    }
    authContext?.setAuthState({ token: loginResult.response.token, expiresIn: loginResult.response.expiryIn });
    grantAccess(loginResult.user);
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