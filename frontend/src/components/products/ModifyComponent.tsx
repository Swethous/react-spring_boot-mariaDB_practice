import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { getOne, putOne, deleteOne } from "../../api/productsApi";
import FetchingModal from "../common/FetchingModal";
import type { Product } from "../../types/product";
import useCustomMove from "../../hooks/useCustomMove";
import ResultModal from "../common/ResultModal";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

type ModifyComponentProps = {
  pno: number;
};

const initState: Product = {
    pno:0,
    pname:'',
    pdesc:'',
    price: 0,
    delFlag: false,
    uploadFileNames: []
}

const ModifyComponent = ({pno}: ModifyComponentProps) => {
    const [product, setProduct] = useState(initState)

    // const [fetching, setFetching] = useState(false)

    // const[result, setResult] = useState<string | null>(null)

    const{moveToProductRead, moveToProductList} = useCustomMove()

    const uploadRef = useRef<HTMLInputElement | null >(null)

    // useEffect(() => {
    //     setFetching(true)
    //     getOne(pno).then((data) => {
    //         setProduct(data)
    //         setFetching(false);
    //     })
    // }, [pno])

    const { data, isFetching, isSuccess } = useQuery<Product>({
    queryKey: ['products', pno],
    queryFn: () => getOne(pno),
    staleTime: Infinity,
    enabled: pno > 0,
    })

    useEffect(() => {
    if (isSuccess && data) {
        setProduct(data) // 초기값 세팅
    }
    }, [isSuccess, data])

    const delMutation = useMutation({
    mutationFn: (pno: number) => deleteOne(pno)})
    const queryClient = useQueryClient()



    const handleChangeProduct = (e:ChangeEvent<HTMLInputElement| HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProduct((prev) => ({
            ...prev,
            [name]:
             name === "price" ? Number(value)
             : name === "delFlag" ? value === "true"
             : value,
        }))
    }
    const handleClickDelete = () => {
        delMutation.mutate(pno)
    }

    const deleteOldImages = (imageName: string) => {
        const resultFileNames = product.uploadFileNames.filter(fileName => fileName !== imageName)

        product.uploadFileNames = resultFileNames

        setProduct({...product})
    }

    const modMutation = useMutation({
        mutationFn: (formdata: FormData)=> putOne(pno, formdata)


    })

    const handleClickModify = () => {
        const files = uploadRef.current?.files
        const formData = new FormData()
        if(files) {
            for(let i = 0; i<files.length; i++) {
                formData.append("files", files[i])
            }
        }

        formData.append("pname", product.pname)
        formData.append("pdesc", product.pdesc)
        formData.append("price", String(product.price))
        formData.append("delFlag", String(product.delFlag))
        for ( let i =0; i < product.uploadFileNames.length ; i++) {
            formData.append("uploadFileNames", product.uploadFileNames[i])
        }

        modMutation.mutate(formData)
    }

    const closeModal = () => {
        if(delMutation.isSuccess) {
            queryClient.invalidateQueries({queryKey:['products' , pno]})
            queryClient.invalidateQueries({queryKey:['products/list']})
            moveToProductList()
        }
        if(modMutation.isSuccess) {
            queryClient.invalidateQueries({queryKey:['products' , pno]})
            queryClient.invalidateQueries({queryKey:['products/list']})
            moveToProductRead(pno)
        }
    }

    return (
    <div className="border-2 border-sky-200 mt-10 m-2 p-4">

        {(isFetching|| delMutation.isPending || modMutation.isPending) && <FetchingModal/>}

        { delMutation.isSuccess || modMutation.isSuccess ? 
            <ResultModal
            title={`처리결과`}
            content={'정상적으로 처리되었습니다.'}
            callbackFn={closeModal}
            />
            : <></>
        }

        {/* {fetching && <FetchingModal />}

        {result?
            <ResultModal
            title={`${result}`}
            content={'정상적으로 처리되었습니다.'}
            callbackFn={closeModal}
            />
            : <></>
        } */}

        {/* Product Name */}
        <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
            <div className="w-1/5 p-6 text-right font-bold">Product Name</div>
            <input
            className="w-4/5 p-6 rounded-r border border-solid border-neutral-300 shadow-md"
            name="pname"
            type="text"
            value={product.pname}
            onChange={handleChangeProduct}
            />
        </div>
        </div>

        {/* Description */}
        <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
            <div className="w-1/5 p-6 text-right font-bold">Desc</div>
            <textarea
            className="w-4/5 p-6 rounded-r border border-solid border-neutral-300 shadow-md resize-y"
            name="pdesc"
            rows={4}
            value={product.pdesc}
            onChange={handleChangeProduct}
            />
        </div>
        </div>

        {/* Price */}
        <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
            <div className="w-1/5 p-6 text-right font-bold">Price</div>
            <input
            className="w-4/5 p-6 rounded-r border border-solid border-neutral-300 shadow-md"
            name="price"
            type="number"
            value={product.price}
            onChange={handleChangeProduct}
            />
        </div>
        </div>

        {/* Delete Flag */}
        <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
            <div className="w-1/5 p-6 text-right font-bold">DELETE</div>
            <select
            name="delFlag"
            value={String(product.delFlag)}
            onChange={handleChangeProduct}
            className="w-4/5 p-6 rounded-r border border-solid border-neutral-300 shadow-md"
            >
            <option value="false">사용</option>
            <option value="true">삭제</option>
            </select>
        </div>
        </div>

        {/* File Upload */}
        <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
            <div className="w-1/5 p-6 text-right font-bold">Files</div>
            <input
            ref={uploadRef}
            className="w-4/5 p-6 rounded-r border border-solid border-neutral-300 shadow-md"
            type="file"
            multiple
            />
        </div>
        </div>

        {/* Images */}
        <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
            <div className="w-1/5 p-6 text-right font-bold">Images</div>
            <div className="w-4/5 justify-center flex flex-wrap items-start">
            {product.uploadFileNames.map((imgFile, i) => (
                <div
                key={i}
                className="flex justify-center flex-col w-1/3 m-1 align-baseline"
                >
                <button
                    type="button"
                    className="bg-blue-500 text-3xl text-white"
                    onClick={() => deleteOldImages(imgFile)}
                >
                    DELETE
                </button>

                <img
                    alt="img"
                    src={`http://localhost:8080/api/products/view/s_${imgFile}`}
                />
                </div>
            ))}
            </div>
        </div>
        </div>
        <div className="flex justify-end p-4">
            <button type="button"
                className="rounded p-4 m-2 text-xl w-32 text-white bg-red-500"
                onClick={handleClickDelete}    
            >
                Delete
            </button>
            <button type="button"
                className="inline-block rounded p-4 m-2 text-xl w-32 text-white bg-orange-500"
                onClick={handleClickModify}
            >
                Modify
            </button>
            <button type="button"
                className="rounded p-4 m-2 text-xl w-32 text-white bg-blue-500">
                List
            </button>
        </div>

    </div>
    );

}

export default ModifyComponent;