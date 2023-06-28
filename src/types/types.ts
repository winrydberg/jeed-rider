export interface IUserData {
    id?: any | null;
    firstname: string | null;
    lastname: string | null;
    profile_photo?: string;
    profile_bg?: string;
    email: string | null;
    active_status: boolean;
    has_vehicle:boolean;
    password: string | null;
    phoneno: string | null;
    verified: boolean | null;
    referalcode: string | null;
    registrationtoken: string | null;
    device_name: string | null;
    created_at?: string | null;
    updated_at?: string | null;
    coupon_rate?: any;
    total_earning: number|string;
    payjeed?: number|string;
    has_coupon?: boolean;
    commission_percentage?: number|string;
  }
  
  export interface ILoginData {
    phoneno: string | null;
    password: string | null;
  }
  
  export interface IRegisterData {
    email: string;
    password: string;
    firstname: string;
    lastname: string;
    phoneno: string;
    firebasetoken: string;
  }
  
  export interface InputError {
    code: string;
    message: string;
  }
  
  export interface Location {
    latitude: number;
    longitude: number;
  }
  
  export interface IPackageTypes {
    id: any;
    name: string;
    created_at: any;
    updated_at: any;
  }
  
  export interface DropOffData {
    loc_name: string;
    lat: number;
    lng: number;
    msisdn: string;
  }
  
  export interface IDropOff {
    id?: any;
    dropoff_loc_name: string;
    dropoff_lat: number;
    dropoff_lng: number;
    dropoff_msisdn: string;
    delivery_id: any;
    created_at?: any;
    updated_at?: any;
  }
  
  export interface IDeliveryData {
    pickup_loc_name: string;
    pickup_lat: number;
    pickup_lng: number;
    dropoffs: Array<IDropOff>;
    pickup_msisdn: string;
    package_type_id: string;
    payment_type_id: string;
    delivery_mode_id: string;
    momo_accno: string;
    paymentinfo:any;
    payingvia: any
  }
  
  export interface DeliveryMode {
    id?: any;
    name: string;
    slug: string;
    image: string;
    is_active: boolean;
    amount_per_km: number;
    created_at?: any;
    updated_at?: any;
  }
  
  export interface Rider {}
  
  export interface PaymentMethod {
    id?: any;
    name: string;
    image: string;
    type: string;
    created_at: string;
    updated_at: string;
  }
  
  export interface IDelivery {
    id?: any;
    pickup_loc_name: string;
    pickup_lat: number;
    pickup_lng: number;
    pickup_msisdn: string;
    user_id?: number | string;
    delivery_mode?: DeliveryMode;
    rider: Rider | null;
    package_type?: IPackageTypes;
    payment_type: PaymentMethod | null;
    completed: boolean;
    is_cancelled: boolean;
    note: string;
    payment_no: any;
    delivery_fare: number | null;
    delivery_status: string;
    is_return_trip: boolean;
    tracker_code: string;
    dropoffs?: Array<IDropOff>;
    completioncode: string|number;
    paid: boolean;
    created_at: any;
    updated_at: any;
  }

  export interface IInsuranceType {
    id?: any;
    name: string;
    created_at: string;
    updated_at: string;
  }

  export interface NewVehicleData {
    vehicletype: string;
    regno:string;
    dvla:string;
    insurancetype:string;
    insuranceno:string;
    insurancesticker:string;
  }

  export interface IPaymentRequestData {
    amount: string;
    paid:string;
    rider_id: any
    created_at: any;
    updated_at: any;
  }
  