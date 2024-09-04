import { RegisterForm } from "./Operations/RegisterForm";

export function RegisterPage() {
  return (
    <div className="flex flex-col">
      <div className="m-auto flex-grow ">
        <RegisterForm />
      </div>
    </div>
  );
}
