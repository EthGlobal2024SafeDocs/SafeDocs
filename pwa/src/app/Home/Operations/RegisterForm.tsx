import { SubmitHandler, useForm } from "react-hook-form";
import { Button, Label, TextInput } from "flowbite-react";
import { RegisterUserService } from "@/services/user";
import { useNavigate, useRouteContext } from "@tanstack/react-router";

type RegisterForm = {
  username: string;
  email: string;
};

export function RegisterForm() {
  const { register, handleSubmit } = useForm<RegisterForm>();
  const { login } = useRouteContext({ strict: false });
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<RegisterForm> = async (data) => {
    // todo: register the user to the server and then store it locally
    const { user, token } = await RegisterUserService(data.username, data.email);

    await login!(user, token.token, token.expiryIn);

    navigate({ to: "/documents" });
  };

  return (
    <div className="mx-auto w-80">
      <form onSubmit={handleSubmit(onSubmit)} className="flex max-w-md flex-col gap-4">
        <div>
          <div className="mb-2 block">
            <Label htmlFor="username" value="Username" />
          </div>
          <TextInput {...register("username")} />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="email" value="email" />
          </div>
          <TextInput {...register("email")} />
        </div>

        <Button type="submit">Register</Button>
      </form>
    </div>
  );
}
