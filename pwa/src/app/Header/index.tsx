import { Link, useRouteContext } from "@tanstack/react-router";
import { Button, Navbar } from "flowbite-react";
import Logo from "@/assets/logo.png";

export default function Header() {
  const { token, logout } = useRouteContext({ from: "__root__" });

  return (
    <Navbar fluid rounded>
      <Navbar.Brand as={Link} to={"/"} className="">
        <img src={Logo} className="h-6" />
      </Navbar.Brand>

      {token && (
        <>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <li className="py-1">
              <Link to={"/documents"}> My Documents</Link>
            </li>
            <li className="py-1">
              <Link to={"/shared"}> Shared</Link>
            </li>
            <li className="py-1">
              <Button size="xs" color="purple" onClick={logout}>
                Logout
              </Button>
            </li>
          </Navbar.Collapse>
        </>
      )}
    </Navbar>
  );
}
