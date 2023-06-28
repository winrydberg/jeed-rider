import { combineReducers, configureStore } from '@reduxjs/toolkit'
import userReducer from './reducers/userReducer';
import deliveryReducer from './reducers/deliveryReducer';


const rootReducer = combineReducers({
  user: userReducer,
  delivery: deliveryReducer,
});

export const store = configureStore({
  reducer: rootReducer
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch  //55!