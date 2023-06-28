import { DeliveryMode, IDelivery, IInsuranceType, Location } from "../../types/types";
import { SET_USER, SET_TOKEN, SET_INSURANCE_TYPES, SET_DELIVERY_MODESS, SET_USR_LOCATION } from "../mutationtypes";

type Action = {
    type: string;
    payload: any;
}

type State = {
    user: undefined | null;
    token: string | undefined | null;
    current_location: Location | null;
    my_deliveries: IDelivery[];
    insurance_types: IInsuranceType[]
    deliverymodes: DeliveryMode[]
}

const initialState: State = {
    user: null,
    token: null,
    current_location: {longitude: -0.236193, latitude: 5.706244 },
    my_deliveries: [],
    insurance_types: [],
    deliverymodes: []
};


const userReducer = (state: State = initialState, action: Action) => {
    switch (action.type) {
        case SET_USER:
            return {
                ...state,
                user: action.payload,
            };
        case SET_TOKEN:
            console.log("Token Set");
            return {
                ...state,
                token: action.payload,
            };
        case SET_INSURANCE_TYPES:
            return {
                ...state,
                insurance_types: action.payload,
            };
        case SET_DELIVERY_MODESS:
            return {
                ...state,
                deliverymodes: action.payload,
            };
        case SET_USR_LOCATION:
            return {
                ...state,
                current_location: action.payload,
            };
        default:
            return state;
    }
}

export default userReducer;