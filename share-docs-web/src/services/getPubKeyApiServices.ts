import axios from '../client/customAxios';

const GET_PUB_KEY = 'publicKeys/:email';

const addToken = (token: string) => {
  return {
    headers: {
      Authorization: "Bearer " + token
   }
  }
}

export interface GetPublicKeyResponse {
  public_key: string;
}

export const getPublicKeyApi = async (token: string, email: string): Promise<GetPublicKeyResponse> => {
  const config = addToken(token);
  const GET_PUB_KEY_URL = GET_PUB_KEY.replace(':email', email);
  const response = await axios.get(GET_PUB_KEY_URL, config);
  if (response.status && response.status !== 200) {
    throw new Error(response.statusText);
  }
  return response.data;
};
