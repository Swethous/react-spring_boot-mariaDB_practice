import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getCartItems, postChangeCart } from "../api/cartApi";
import type { CartItem, ChangeCartRequest } from "../types/cart";



// 장바구니 조회
export const getCartItemsAsync = createAsyncThunk(
  "getCartItemsAsync",
  async () => {
    return await getCartItems();
  }
);

export const postChangeCartAsync = createAsyncThunk<CartItem[], ChangeCartRequest>(
    "postCartItemsAsync",
    async (param) => {
        return await postChangeCart(param);
    }
)

// 초기 상태
const initState: CartItem[] = [];

const cartSlice = createSlice({
  name: "cartSlice",
  initialState: initState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCartItemsAsync.fulfilled, (state, action) => {
        console.log("getCartItemsAsync fulfilled");
        return action.payload;
      })
      .addCase(postChangeCartAsync.fulfilled, (state, action) => {
        console.log("postCartItemsAsync fulfilled");
        return action.payload;
      });
  },
});

export default cartSlice.reducer;
