import { useAppDispatch, useAppSelector } from "../store/hooks";
import { getCartItemsAsync, postChangeCartAsync } from "../slices/cartSlice";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import type { ChangeCartRequest } from "../types/cart";

const useCustomCart = () => {
    const cartItems = useSelector((state:RootState) => state.cartSlice)

    const dispatch = useAppDispatch()

    const refreshCart = () => {
        dispatch(getCartItemsAsync())
    }

    const changeCart = (req: ChangeCartRequest) => {
        dispatch(postChangeCartAsync(req))
    }
    return { cartItems, refreshCart, changeCart}
}

export default useCustomCart;