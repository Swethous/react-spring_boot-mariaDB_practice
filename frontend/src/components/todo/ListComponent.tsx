import { useEffect, useState } from "react";
import { getList } from "../../api/todoApi";
import useCustomMove from "../../hooks/useCustomMove";
import PageComponent from "../common/PageComponent";

// 서버에서 리스트 받을 때 사용하는 타입
type ListResponseType = {
  dtoList: any[];                // 실제 DTO 타입 있으면 바꿔도 됨
  pageNumList: number[];
  pageRequestDTO: {
    page: number;
    size: number;
  } | null;
  prev: boolean;
  next: boolean;
  totalCount: number;
  prevPage: number;
  nextPage: number;
  totalPage: number;
  current: number;
};

// 초기값
const initState: ListResponseType = {
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
  const { page, size, refresh, moveToList, moveToRead } = useCustomMove();
  const [serverData, setServerData] = useState<ListResponseType>(initState);

  useEffect(() => {
    getList({ page, size }).then((data) => {
      console.log(data);
      setServerData(data);
    });
  }, [page, size, refresh]);

  return (
    <div className="border-2 border-blue-100 mt-10 mr-2 ml-2">
        <div className="flex flex-wrap mx-auto justify-center p-6">
            {serverData?.dtoList.map(todo =>
                <div key={todo.tno} className="w-full min-w-[400px] p-2 m-2 rounded shadow-md cursor-pointer" onClick={() => moveToRead(todo.tno)}>
                    <div className="flex">
                        <div className="font-extrabold text-2xl p-2 w-1/12">{todo.tno}</div>
                        <div className="text-1x1 m-1 p-2 w-8/12 font-extrabold">{todo.title}</div>
                        <div className="text-1x1 m-1 p-2 w-2/10 font-medium">{todo.dueDate}</div>
                    </div>
                </div>
            )}
        </div>
        <PageComponent serverData={serverData} movePage={moveToList}></PageComponent>
    </div>
  );
};

export default ListComponent;
