import { SubmitHandler, useForm } from "react-hook-form";
import { Button, Label, TextInput } from "flowbite-react";
import { getUserByUsername } from "@/services/db";
import { useMutation } from "@tanstack/react-query";
import { LoginUserService } from "@/services/user";
import { useRouteContext } from "@tanstack/react-router";

type LoginForm = {
  username: string;
};

export function LoginForm() {
  const { register, handleSubmit } = useForm<LoginForm>();
  const { login } = useRouteContext({ from: "__root__" });

  const { mutate } = useMutation({
    mutationKey: ["login"],
    mutationFn: async (username: string) => {
      // todo: check if the user existing in browser database
      const user = await getUserByUsername(username);
      if (user) {
        const token = await LoginUserService(user);
        console.log("token", token);
        await login(user, token.token, token.expiryIn);
      } else {
        console.log("no user found");
        throw Error("user does not exist!");
      }
    }
  });

  const onSubmit: SubmitHandler<LoginForm> = async ({ username }) => {
    await mutate(username);
  };

  return (
    <div className="mx-auto w-80">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex max-w-md flex-col gap-4"
      >
        <div>
          <div className="mb-2 block">
            <Label htmlFor="username" value="Username" />
          </div>
          <TextInput {...register("username")} />
        </div>

        <Button type="submit">Login</Button>
      </form>
    </div>
  );
}
