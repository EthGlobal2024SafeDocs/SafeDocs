import axios from '../client/customAxios';
import Wallet from '../models/api/wallet';

const POST_REGISTER = 'register';

export const registerUser = async (email: string, signature: string): Promise<Wallet> => {
  const request = { email, signature };
  const response = await axios.post(POST_REGISTER, request);

  if (response.status && response.status !== 200) {
    throw new Error(response.statusText);
  }
  return response.data;
};
