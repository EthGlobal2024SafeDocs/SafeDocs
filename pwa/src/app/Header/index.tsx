import { Link, useRouteContext } from "@tanstack/react-router";
import { Navbar } from "flowbite-react";
import Logo from "@/assets/logo.png";

export default function Header() {
  const { isLoggedIn } = useRouteContext({ strict: false });

  return (
    <Navbar fluid rounded>
      <Navbar.Brand>
        <Link to="/">
        <img src={Logo} className="mr-3 h-6 sm:h-9 bg-slate-600" />
        </Link>
      </Navbar.Brand>
      {/* <Navbar.Toggle /> */}

      {isLoggedIn && (
        <Navbar.Collapse>
          <Link to="/documents">Documents</Link>

          <Navbar.Link as={Link}>Shares</Navbar.Link>
        
        </Navbar.Collapse>
      )}
    </Navbar>
  );
}
