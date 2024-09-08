import { Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Header from "../Header";

export default function LoggedInLayout() {
  return (
    <>
      <div className="p-2">
        <Header />
      </div>
      <hr />
      <main className="container mx-auto px-4 lg:px-0 pt-2">
        <Outlet />
      </main>

      {/* <ReactQueryDevtools /> */}
      <TanStackRouterDevtools />
    </>
  );
}
