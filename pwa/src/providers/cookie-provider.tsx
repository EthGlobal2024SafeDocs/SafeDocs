import { ReactElement } from "react";
import { CookiesProvider } from "react-cookie";

export default function CookieProvider({ children }: { children: ReactElement }) {
  return <CookiesProvider defaultSetOptions={{ path: "/" }}>{children}</CookiesProvider>;
}
