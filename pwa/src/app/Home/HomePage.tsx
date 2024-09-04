import { useNavigate, useRouteContext, Link } from "@tanstack/react-router";
import { LoginForm } from "./Operations/LoginForm";

export function HomePage() {
  const context = useRouteContext({ strict: false });
  const navigate = useNavigate();

  const handleOnLogin = async () => {
    if (context && context.login) {
      await context.login("test token");

      navigate({ to: "/documents" });
    }
  };

  return (
    <div className="flex flex-col content-stretch">
      <div className="py-10"><LoginForm /></div>
      
      <span className="flex gap-x-2 mx-auto">
        <h4>New here?</h4>
        <Link to="/register">Sign Up</Link>
      </span>
    </div>
  );
}
