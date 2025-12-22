import { useEffect, useState } from "react";
import { getOne } from "../../api/productsApi";
import useCustomMove from "../../hooks/useCustomMove";
import type { Product } from "../../types/product";
import FetchingModal from "../common/FetchingModal";
import useCustomCart from "../../hooks/useCustomCart";
import useCustomLogin from "../../hooks/useCustomLogin";
import { useQuery } from "@tanstack/react-query";

type ReadComponentProps = {
    pno: number
}

const initState: Product = {
    pno:0,
    pname:'',
    pdesc:'',
    price: 0,
    delFlag: false,
    uploadFileNames: []
}


const ReadComponent = ({pno}:ReadComponentProps) => {
    // const[product, setProduct] = useState(initState)
    const {moveToProductList, moveToProductModify} = useCustomMove()
    // const [fetching, setFetching] = useState(false)

    const {changeCart, cartItems} = useCustomCart()
    const {loginState} = useCustomLogin()

    const handleClickAddCart = () => {
        let qty = 1

        const addedItem = cartItems.filter(item => item.pno === pno)[0]

        if(addedItem) {
            if(window.confirm("이미 추가된 상품입니다. 추가하시겠습니까?") === false) {
                return
            }
            qty = addedItem.qty + 1
        }
        changeCart({email: loginState.email!, pno:pno, qty:qty})
    }

    // useEffect(() => {
    //     setFetching(true)
    //     getOne(pno).then(data => {

    //         setProduct(data)
    //         setFetching(false)
    //     })
    // },[pno])

    const { data, isFetching, isError, error } = useQuery({
    queryKey: ['products', pno],
    queryFn: () => getOne(pno),
    staleTime: 1000 * 10,
    retry: 1,
    enabled: !!pno,   // pno가 있을 때만 호출
    })

    const product = data|| initState

    return (
    <div className="border-2 border-sky-200 mt-10 m-2 p-4">

        {isFetching && <FetchingModal />}

        {/* PNO */}
        <div className="flex justify-center mt-10">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
            <div className="w-1/5 p-6 text-right font-bold">PNO</div>
            <div className="w-4/5 p-6 rounded-r border border-solid shadow-md">
            {product.pno}
            </div>
        </div>
        </div>

        {/* PNAME */}
        <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
            <div className="w-1/5 p-6 text-right font-bold">PNAME</div>
            <div className="w-4/5 p-6 rounded-r border border-solid shadow-md">
            {product.pname}
            </div>
        </div>
        </div>

        {/* PRICE */}
        <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
            <div className="w-1/5 p-6 text-right font-bold">PRICE</div>
            <div className="w-4/5 p-6 rounded-r border border-solid shadow-md">
            {product.price}
            </div>
        </div>
        </div>

        {/* PDESC */}
        <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
            <div className="w-1/5 p-6 text-right font-bold">PDESC</div>
            <div className="w-4/5 p-6 rounded-r border border-solid shadow-md">
            {product.pdesc}
            </div>
        </div>
        </div>

        {/* Images */}
        <div className="w-full flex flex-col items-center justify-center m-auto">
        {product.uploadFileNames.map((imgFile: string, i: number) => (
            <img
            key={i}
            alt="product"
            className="p-4 w-1/2"
            src={`http://localhost:8080/api/products/view/${imgFile}`}
            />
        ))}
        </div>

        {/* Buttons */}
        <div className="flex justify-end p-4">
        <button
            type="button"
            className="inline-block rounded p-4 m-2 text-xl w-32 text-white bg-green-500"
            onClick={() => handleClickAddCart()}
        >
            Add Cart
        </button>
        <button
            type="button"
            className="inline-block rounded p-4 m-2 text-xl w-32 text-white bg-red-500"
            onClick={() => moveToProductModify(pno)}
        >
            Modify
        </button>

        <button
            type="button"
            className="rounded p-4 m-2 text-xl w-32 text-white bg-blue-500"
            onClick={() => moveToProductList()}
        >
            List
        </button>
        </div>

    </div>
    );

}


export default ReadComponent