import { SignMessageReturnType } from "viem";

type LoginResponse = {
  token: string;
  expiryIn: number;
};

type RegisterResponse = {
  _id: string;
};

export const LoginUser = async (
  email: string,
  signature: SignMessageReturnType
): Promise<LoginResponse> => {
  const result = await fetch(`${import.meta.env.VITE_base_url}/login`, {
    body: JSON.stringify({ email, signature }),
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  });

  if (result.status != 200) {
    throw Error(await result.json());
  }
  return await result.json();
};

export const RegisterUser = async (
  email: string,
  signature: SignMessageReturnType
): Promise<RegisterResponse> => {
  const result = await fetch(`${import.meta.env.VITE_base_url}/register`, {
    body: JSON.stringify({ email, signature }),
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  });

  if (result.status != 200) {
    throw Error(await result.json());
  }
  return await result.json();
};
