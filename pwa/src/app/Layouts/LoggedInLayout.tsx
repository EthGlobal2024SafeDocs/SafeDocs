import { Outlet, useRouteContext } from "@tanstack/react-router";
// import { TanStackRouterDevtools } from "@tanstack/router-devtools";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Header from "../Header";

export default function LoggedInLayout() {
  const { userEmail } = useRouteContext({ from: "__root__" });
  return (
    <>
      <div className="p-2">
        <Header />
      </div>
      <hr />
      <main className="container mx-auto px-4 py-4 lg:px-0">
        <Outlet />
      </main>
      <footer className="mx-auto block px-2 pt-4 text-xs border-t">logged-in as: {userEmail}</footer>

      {/* <ReactQueryDevtools /> */}
      {/* <TanStackRouterDevtools /> */}
    </>
  );
}
