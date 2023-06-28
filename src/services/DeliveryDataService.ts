import {CancelToken} from 'axios';
import http from '../helpers/axios';
import {
  IDeliveryFareResponse,
  IDeliveryModesReponse,
  IDeliveryReponse,
  ILoginResponse,
  IPackageReponse,
  IPaymentMethodResponse,
  IPendingDeliveriesResponse,
  IAcceptResponse,
  IMyDeliveryPendingCountResponse,
  IMyDeliveryResponse,
  IMainResponse
} from '../types/responses';
import {
  IDeliveryData,
  ILoginData,
  IPackageTypes,
  IRegisterData,
  IUserData,
} from '../types/types';

class DeliveryDataService {


  getPendingDeliveries(token: string) {
    return http.get<IPendingDeliveriesResponse>('/pending-deliveries', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },);
  }
  acceptUserDelivery(deliveryid: number|string, token: string ) {
    return http.post<IAcceptResponse>('/accept-delivery',{
      id: deliveryid
    },{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  getDeliveryPendingCount(token: string) {
    // console.log(token)
    return http.get<IMyDeliveryPendingCountResponse>('/my-pending-deliveries',
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  getMyDeliveries(token: string) {
    return http.get<IMyDeliveryResponse>('/my-deliveries',{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  getMyPendingDeliveries = (token: string) => {
    return http.get<IMyDeliveryResponse>('/list-pending-deliveries',{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  completeDelivery(deliveryid:any, completioncode:string, token: string) {
    return http.post<IMainResponse>('/complete-delivery',{
      completioncode: completioncode,
      id: deliveryid
    }, 
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  cancelDelivery(deliveryid: string|number, token: string) {
    return http.post<IMainResponse>('/cancel-delivery',{
      id: deliveryid
    },{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  calculateFare(pickup_loc_name:string, dropoffs: any) {
    return http.post<IDeliveryFareResponse>('/calculate-fare',{
      pickup_name: pickup_loc_name,
      dropoffs: dropoffs
    });
  }
}

export default new DeliveryDataService();
