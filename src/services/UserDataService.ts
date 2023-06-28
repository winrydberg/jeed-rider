
import http from '../helpers/axios';
import {
  IDeliveryModesReponse,
  IIsuranceTypeResponse,
  ILoginResponse,
  IMainResponse,
  IMyDeliveriesResponse,
  INewVehicleResponse,
  IRegisterResponse,
  IRiderPaymentResponse
} from '../types/responses';
import {ILoginData, IRegisterData, IUserData, NewVehicleData} from '../types/types';

class UserDataService {
  registerUser(data: IRegisterData) {
    return http.post<IRegisterResponse>('/register', {
      email: data.email,
      firstname: data.firstname,
      lastname: data.lastname,
      password: data.password,
      phoneno: data.phoneno,
      registrationtoken: data.firebasetoken,
      city_id: 1
    });
  }

  loginUser(data: ILoginData) {
    return http.post<ILoginResponse>('/login', {
      phoneno: data.phoneno,
      password: data.password,
    });
  }

  getMyDeliveries(token: string) {
    return http.get<IMyDeliveriesResponse>('/my-deliveries', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  getInsuranceTypes(token: string) {
    return http.get<IIsuranceTypeResponse>('/insurance-types', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  getDeliveryModes() {
    return http.get<IDeliveryModesReponse>('/delivery-modes');
  }

  addVehicle(data: NewVehicleData, token: string) {
    return http.post<INewVehicleResponse>(
      '/add-vehicle',
      {
        vehicletype: data.vehicletype,
        regno: data.regno,
        dvla: data.dvla,
        insurancetype: data.insurancetype,
        insuranceno: data.insuranceno,
        insurancesticker: data.insurancesticker,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }

  requestPayment(token: string) {
    return http.post<IMainResponse>(
      '/request-payment',{},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }


  sendPaymentInformation(token: string, data:any) {
    return http.post<IRiderPaymentResponse>(
      '/rider-paid',{
        data: data
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }



  

  // updateProfilePhoto(token: string, data: string) {
  //   return http.post<ProfileUpdateResponse>(
  //     '/update-photo',
  //     {
  //       photo: data,
  //     },
  //     {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     },
  //   );
  // }
}

export default new UserDataService();
