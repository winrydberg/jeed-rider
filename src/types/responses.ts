import {
  DeliveryMode,
  IDelivery,
  IInsuranceType,
  IPackageTypes,
  IUserData,
  PaymentMethod,
} from './types';

interface IResponse {
  status: string;
  message: string;
}

export interface IRegisterResponse extends IResponse {
  user?: IUserData;
  token?: string;
}

export interface ILoginResponse extends IResponse {
  user?: IUserData;
  token: string;
}

export interface IDeliveryReponse extends IResponse {
  next: number;
  delivery: IDelivery;
}

export interface IPackageReponse extends IResponse {
  types: Array<IPackageTypes>;
}

export interface IDeliveryModesReponse extends IResponse {
  modes: Array<DeliveryMode>;
}

export interface IPaymentMethodResponse extends IResponse {
  paymenttypes: Array<PaymentMethod>;
}

export interface IMyDeliveriesResponse extends IResponse {
  deliveries?: Array<IDelivery>;
}

export interface IPendingDeliveriesResponse extends IResponse {
  deliveries?: Array<IDelivery>;
}
export interface IDeliveryFareResponse extends IResponse {
  amount?: any;
  distance?: any;
}

export interface IAcceptResponse extends IResponse {
  id?: any;
}

export interface IMyDeliveryPendingCountResponse extends IResponse {
  pendingCount?: string|number;
}

export interface IMyDeliveryResponse extends IResponse {
  deliveries: IDelivery[]
}

export interface IMainResponse extends IResponse {
  rider?:IUserData
}

export interface IIsuranceTypeResponse extends IResponse {
  insurancetypes: IInsuranceType[]
}

export interface INewVehicleResponse extends IResponse {
  rider: IUserData
}

export interface IRiderPaymentResponse extends IResponse {
  rider: IUserData
}
