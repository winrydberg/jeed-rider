import {IDelivery, IUserData, Location} from '../../types/types';
import {
  SET_MY_DELIVERIES,
  SET_TOKEN,
  SET_USER,
  SET_USR_LOCATION,
  SET_PENDING_DELIVERIES,
  REMOVE_FROM_PENDING_DELIVERIES,
  SET_MY_PENDING_COUNT,
  SET_MY_PENDING_DELIVERIES,
  REMOVE_FROM_MY_PENDING_DELIVERIES
} from '../mutationtypes';



export function setPendingDeliveries(deliveries: IDelivery[]) {
  return {
    type: SET_PENDING_DELIVERIES,
    payload: deliveries,
  };
}

export function removeFromPendingDeliveries(id: number|string) {
    return {
      type: REMOVE_FROM_PENDING_DELIVERIES,
      payload: id,
    };
}

export function setMyPendingCount(count: number|string) {
    return {
      type: SET_MY_PENDING_COUNT,
      payload: count,
    };
}


export function setMyDeliveries(deliveries: IDelivery[]) {
    return {
      type: SET_MY_DELIVERIES,
      payload: deliveries,
    };
}

export function setMyPendingDeliveries(deliveries: IDelivery[]) {
  return {
    type: SET_MY_PENDING_DELIVERIES,
    payload: deliveries,
  };
}

export function removeFromMyPendingDeliveries(deliveryid: string|number) {
  console.log("FROM function");
  return {
    type: REMOVE_FROM_MY_PENDING_DELIVERIES,
    payload: deliveryid,
  };
}
