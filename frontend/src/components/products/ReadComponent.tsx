import { useEffect, useState } from "react";
import { getOne } from "../../api/productsApi";
import useCustomMove from "../../hooks/useCustomMove";
import type { Product } from "../../types/product";
import FetchingModal from "../common/FetchingModal";

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
    const[product, setProduct] = useState(initState)
    const {moveToProductList, moveToProductModify} = useCustomMove()
    const [fetching, setFetching] = useState(false)

    useEffect(() => {
        setFetching(true)
        getOne(pno).then(data => {

            setProduct(data)
            setFetching(false)
        })
    },[pno])

    return (
    <div className="border-2 border-sky-200 mt-10 m-2 p-4">

        {fetching && <FetchingModal />}

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
        {product.uploadFileNames.map((imgFile, i) => (
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