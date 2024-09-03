import { Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import Header from "./Header";

export default function PublicLayout() {
  return (
    <>
      <div className="p-2 flex gap-2">
        <Header />
      </div>
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  );
}
