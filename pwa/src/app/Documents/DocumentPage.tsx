import { useRouteContext } from "@tanstack/react-router";

export function DocumentPage() {
  const {token} = useRouteContext({ from: "/_auth" });
  return <div>{token}</div>;
}
