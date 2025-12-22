import { useEffect, useState } from "react";
import { getList } from "../../api/productsApi";
import useCustomMove from "../../hooks/useCustomMove";
import FetchingModal from "../common/FetchingModal";
import type { Product } from "../../types/product";
import type { PageResponse } from "../../types/common";
import PageComponent from "../common/PageComponent";
import useCustomLogin from "../../hooks/useCustomLogin";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const initState: PageResponse<Product> = {
  dtoList: [],
  pageNumList: [],
  pageRequestDTO: null,
  prev: false,
  next: false,
  totalCount: 0,
  prevPage: 0,
  nextPage: 0,
  totalPage: 0,
  current: 0,
};


const ListComponent = () => {

  const {moveToLoginReturn} = useCustomLogin()

  const { page, size, refresh, moveToProductList, moveToProductRead } = useCustomMove();

  // serverData는 나중에 사용
  // const [serverData, setServerData] = useState(initState);

  // for FetchingModal
  // const [fetching, setFetching] = useState(false);

  // useEffect(() => {
  //   setFetching(true);

  //   getList({ page, size }).then(data => {
  //     console.log(data);
  //     setServerData(data);
  //     setFetching(false);
  //   }).catch(err=>exceptionHandel(err));

  // }, [page, size, refresh]);

  const { data, isFetching, isError, error } = useQuery({
    queryKey: ['products','list', page,size],
    queryFn: () => getList({page,size}),
    staleTime: 1000* 5,
  })

  const queryClient = useQueryClient()

  const handleClickPage = (pageParam:any) => {
    if(pageParam.page === page){
      queryClient.invalidateQueries({queryKey: ['products','list']})
    }
    moveToProductList(pageParam)
  }

  if (isError) {
    console.log(error)
    return moveToLoginReturn()
  }

  const serverData = data || initState

    return (
    <div className="border-2 border-blue-100 mt-10 mr-2 ml-2">
        {isFetching ? <FetchingModal /> : <></>}

        <div className="flex flex-wrap mx-auto p-6">
        {serverData.dtoList.map((product:Product) => (
            <div
            key={product.pno}
            className="w-1/2 p-1 rounded shadow-md border-2 cursor-pointer"
            onClick={() => moveToProductRead(product.pno)}
            >
            <div className="flex flex-col h-full">

                <div className="font-extrabold text-2xl p-2 w-full">
                {product.pno}
                </div>

                <div className="text-xl m-1 p-2 w-full flex flex-col">
                <div className="w-full overflow-hidden">
                    <img
                    alt="product"
                    className="m-auto rounded-md w-60"
                    src={`http://localhost:8080/api/products/view/s_${product.uploadFileNames[0]}`}
                    />
                </div>

                <div className="bottom-0 font-extrabold bg-white p-1">
                    <div className="text-center">
                    이름: {product.pname}
                    </div>
                    <div className="text-center p-1">
                    가격: {product.price}
                    </div>
                </div>

                </div>
            </div>
            </div>
        ))}
        </div>
        <PageComponent serverData={serverData} movePage={handleClickPage}></PageComponent>
    </div>
    );

};

export default ListComponent;
