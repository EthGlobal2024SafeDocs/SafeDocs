/* eslint-disable @typescript-eslint/no-explicit-any */
import { SignMessageReturnType } from 'viem';
import axios from '../client/customAxios';

const POST_LOGIN = 'login';

export interface LoginResponse {
  token: string;
  expiryIn: number;
}

export const loginUserApi = async (email: string, signature: SignMessageReturnType): Promise<LoginResponse> => {
  const request = { email, signature };
  const response = await axios.post(POST_LOGIN, request);
  if (response.status && response.status !== 200) {
    throw new Error(response.statusText);
  }
  return response.data;
  // return { token: 'token', expiryIn: 3600 };
};
