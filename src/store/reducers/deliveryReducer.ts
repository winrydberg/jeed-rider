import { IDelivery, Location } from "../../types/types";
import { REMOVE_FROM_PENDING_DELIVERIES, 
    SET_MY_DELIVERIES, SET_MY_PENDING_COUNT, 
    SET_MY_PENDING_DELIVERIES, SET_PENDING_DELIVERIES, 
    REMOVE_FROM_MY_PENDING_DELIVERIES } from "../mutationtypes";

type Action = {
    type: string;
    payload: any;
}

type State = {
    pending_deliveries: IDelivery[];
    totalpending: number|string,
    mydeliveries: IDelivery[],
    mypendingdeliveries: IDelivery[],
}

const initialState: State = {
    pending_deliveries: [],
    totalpending: 0,
    mydeliveries: [],
    mypendingdeliveries: [],
};

const deliveryReducer = (state: State = initialState, action: Action) => {
    switch (action.type) {
        case SET_PENDING_DELIVERIES:
            return {
                ...state,
                pending_deliveries: action.payload,
            };
        case REMOVE_FROM_PENDING_DELIVERIES:
            return {
                ...state,
                pending_deliveries: state.pending_deliveries.filter((item, i) => item.id != action.payload),
            };
        case SET_MY_PENDING_COUNT:
            return {
                ...state,
                totalpending: action.payload,
            };
        case SET_MY_DELIVERIES:
            return {
                ...state,
                mydeliveries: action.payload,
            };
        case SET_MY_PENDING_DELIVERIES:
            return {
                ...state,
                mypendingdeliveries: action.payload,
            };
        case REMOVE_FROM_MY_PENDING_DELIVERIES:
            // console.log("FROM STORE"+action.payload);
            return {
                ...state,
                mypendingdeliveries: state.mypendingdeliveries.filter((item, i) => item.id != action.payload),
            };
                // var delivery = state.mypendingdeliveries.find(del => {
                //     return del.id === action.payload
                // })
                // var thedel = state.mydeliveries.find(ddel => {
                //     return ddel.id === delivery?.id
                // })
                // if(thedel == undefined){
                //     return {
                //         ...state,
                //         mydeliveries: [...state.mydeliveries, delivery],
                //         mypendingdeliveries: state.mypendingdeliveries.filter((item, i) => item.id != action.payload),
                //     };
                // }else{
                //     return {
                //         ...state,
                //         mypendingdeliveries: state.mypendingdeliveries.filter((item, i) => item.id != action.payload),
                //     };
                // }
                
        default:
            return state;
    }
}

export default deliveryReducer;