import { Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Header from "../Header";

export default function LoggedInLayout() {
  return (
    <>
      <div className="p-2 flex gap-2">
        <Header />
      </div>
      <hr />
      <Outlet />
      {/* <ReactQueryDevtools /> */}
      <TanStackRouterDevtools />
    </>
  );
}
