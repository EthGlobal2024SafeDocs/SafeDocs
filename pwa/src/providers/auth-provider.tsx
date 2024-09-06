import { RouterType } from "@/main";
import { RouterProvider } from "@tanstack/react-router";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

export default function AuthProvider({ router }: { router: RouterType }) {
  const [accessToken, setToken] = useState<string>();
  const [cookies, setCookie, removeCookie] = useCookies<string>(["token"]);

  const handleOnLogin = async (token: string, expiresIn: number) => {
    // store the token in the cookie so we can load it again if exists and not expired
    setCookie("token", token, {
      expires: dayjs().add(expiresIn, "seconds").toDate()
    });
  };
  const handleLogout = async () => {
    console.log("logout called");
    setCookie("token", null, { expires: dayjs().add(-1, "M").toDate() });
  };

  useEffect(() => {
    setToken(cookies["token"]);
  }, [cookies]);

  useEffect(() => {
    if (accessToken) {
      router.navigate({ to: "/documents" });
    } else {
      router.navigate({ to: "/" });
    }
  }, [accessToken]);

  return (
    <>
      <RouterProvider
        router={router}
        context={{
          token: accessToken,
          login: handleOnLogin,
          logout: handleLogout
        }}
      />
    </>
  );
}
