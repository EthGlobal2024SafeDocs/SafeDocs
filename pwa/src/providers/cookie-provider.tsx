import { ReactElement } from "react";
import { CookiesProvider } from "react-cookie";

export default function CookieProvider({
  children
}: {
  children: ReactElement;
}) {
  return (
    <CookiesProvider>
      {children}
    </CookiesProvider>
  );
}
