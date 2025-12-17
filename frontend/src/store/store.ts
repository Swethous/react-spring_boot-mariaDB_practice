import { configureStore } from "@reduxjs/toolkit";
import loginSlice from '../slices/loginSlice'
import cartSlice from '../slices/cartSlice'

export const store = configureStore({
    reducer: {
        "loginSlice" : loginSlice,
        "cartSlice" : cartSlice
    }
})

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;