import { Link, useRouteContext } from "@tanstack/react-router";

export default function Header() {
  const {isLoggedIn} = useRouteContext({ strict:false });

  return (
    <div>
      {isLoggedIn && (<>logged in</>)}
      <Link to="/documents">Documents</Link>
    </div>
  );
}
