export type Handler<TParameter = unknown> = (value?: TParameter) => void;

export enum PageType {
  Welcome,
  Login,
  SignUp
}

export enum DocumentTypes {
  DriversLicense = "DriversLicense"
}

export enum DocumentPageType {
  Add,
  Share,
  Accept,
  View
}