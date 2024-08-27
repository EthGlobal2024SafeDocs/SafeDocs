export type Handler<TParameter = unknown> = (value?: TParameter) => void;

export enum PageType {
  Welcome,
  Login,
  SignUp
}