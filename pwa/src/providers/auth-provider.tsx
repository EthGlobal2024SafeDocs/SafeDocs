import { RouterType } from "@/main";
import { RouterProvider } from "@tanstack/react-router";
import { useState } from "react";

export default function AuthProvider({ router }: { router: RouterType }) {
  const [isAuth, setAuth] = useState(false);
  const [token, setToken] = useState<string>();

  const handleOnLogin = async (nToken: string) => {
    console.log(nToken)
    setToken(nToken);
    setAuth(true);
  };

  return (
    <RouterProvider
      router={router}
      context={{ isLoggedIn: isAuth, token, login: handleOnLogin }}
    />
  );
}
