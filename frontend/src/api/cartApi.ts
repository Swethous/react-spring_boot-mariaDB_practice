import { apiClient } from "./client";
import jwtAxios from "../util/jwtUtil";
import type { ChangeCartRequest, CartItem } from "../types/cart";

export const getCartItems = async ( ) => {

  const res = await jwtAxios.get(`/cart/items`)

  return res.data;
};

export const postChangeCart = async (
    req: ChangeCartRequest
) : Promise<CartItem[]> => {
    const res = await jwtAxios.post(`cart/change`, req);
    return res.data
}