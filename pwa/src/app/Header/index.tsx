import { Link, useRouteContext } from "@tanstack/react-router";
import { Button, Navbar } from "flowbite-react";
import Logo from "@/assets/logo.png";

export default function Header() {
  const { token, logout } = useRouteContext({ from:'__root__' });

  return (
    <Navbar fluid rounded >
      <Navbar.Brand as={Link} to={"/"}>
        <img src={Logo} className="mr-3 h-6 sm:h-9 bg-slate-600" />
      </Navbar.Brand>

      {token && (
        <div>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Navbar.Link as={Link} to={"/documents"}>
              Documents
            </Navbar.Link>
            <Button size="xs" color="purple" onClick={logout}>Logout</Button>
          </Navbar.Collapse>
        </div>
      )}
    </Navbar>
  );
}
