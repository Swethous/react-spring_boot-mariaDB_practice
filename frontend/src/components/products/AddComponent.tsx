import { useRef, useState } from "react";
import { postAdd } from "../../api/productsApi";
import FetchingModal from "../common/FetchingModal";
import ResultModal from "../common/ResultModal";
import useCustomMove from "../../hooks/useCustomMove";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const initState = { 
  pname: '', 
  pdesc: '', 
  price: 0, 
  files: [] 
};

const AddComponent = () => {

  const [product, setProduct] = useState({ ...initState });

  const uploadRef = useRef<HTMLInputElement>(null);

  // const [fetching, setFetching] = useState(false);
  // const[result, setResult] = useState(null);
  
  const { moveToProductList } = useCustomMove()

  const handleChangeProduct = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
    const { name, value } = e.target;

    setProduct((prev) => ({
        ...prev,
        [name]: value
    }));
  };

  const addMutation = useMutation({
    mutationFn: (formData: FormData) => postAdd(formData),
  })

  const queryClient = useQueryClient()


    const handleClickAdd = async (
        e: React.MouseEvent<HTMLButtonElement>
        ) => {
        e.preventDefault();

        const files = uploadRef.current?.files;
        const formData = new FormData();

        if (files && files.length > 0) {
            for (let i = 0; i < files.length; i++) {
            formData.append("files", files[i]);
            }
        }

        formData.append("pname", product.pname);
        formData.append("pdesc", product.pdesc);
        formData.append("price", String(product.price));

        addMutation.mutate(formData)

        // setFetching(true)

        // await postAdd(formData).then(data => {
        //     setFetching(false)
        //     setResult(data.result)
        // });
    };

    const closeModal = () => {
        // setResult(null)
        queryClient.invalidateQueries({queryKey: ['products','list']})
        moveToProductList({page:1})
    }


  return (
    <div className="border-2 border-sky-200 mt-10 m-2 p-4">
        
      {addMutation.isPending ? <FetchingModal/>: <></>}

      {addMutation.isSuccess ? 
        <ResultModal
          title={"Add result"}
          content={`Add success ${addMutation.data.result}`}
          callbackFn={closeModal} />
        :
        <></>
        }

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
            rows= {4}
            onChange={handleChangeProduct}
            value={product.pdesc}
          >
            {product.pdesc}
          </textarea>
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

      {/* Files */}
      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-1/5 p-6 text-right font-bold">Files</div>
          <input
            ref={uploadRef}
            className="w-4/5 p-6 rounded-r border border-solid border-neutral-300 shadow-md"
            type="file"
            multiple={true}
          />
        </div>
      </div>

      {/* ADD Button */}
      <div className="flex justify-end">
        <div className="relative mb-4 flex p-4 flex-wrap items-stretch">
          <button
            type="button"
            className="rounded p-4 w-36 bg-blue-500 text-xl text-white"
            onClick={handleClickAdd}
          >
            ADD
          </button>
        </div>
      </div>

    </div>
  );
};

export default AddComponent;
