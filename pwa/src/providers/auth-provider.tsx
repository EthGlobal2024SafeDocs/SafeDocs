import { RouterType } from "@/main";
import { User } from "@/services/db";
import { RouterProvider } from "@tanstack/react-router";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

export default function AuthProvider({ router }: { router: RouterType }) {
  const [accessToken, setToken] = useState<string>();
  const [userId, setUserId] = useState<number>();
  const [cookies, setCookie] = useCookies<string>(["token", "user"]);

  const handleOnLogin = async (
    user: User,
    token: string,
    expiresIn: number
  ) => {
    // store the token in the cookie so we can load it again if exists and not expired
    setCookie("token", token, {
      expires: dayjs().add(expiresIn, "seconds").toDate()
    });

    setCookie("user", user.id, {
      expires: dayjs().add(expiresIn, "seconds").toDate()
    });
  };
  const handleLogout = async () => {
    console.log("logout called");
    setCookie("token", null, { expires: dayjs().add(-1, "M").toDate() });
    setCookie("user", null, { expires: dayjs().add(-1, "M").toDate() });
  };

  useEffect(() => {
    setToken(cookies["token"]);
    setUserId(cookies["user"]);
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
          userId: userId,
          token: accessToken,
          login: handleOnLogin,
          logout: handleLogout
        }}
      />
    </>
  );
}
