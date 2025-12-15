import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import { getOne, putOne, deleteOne } from "../../api/todoApi";
import useCustomMove from "../../hooks/useCustomMove";
import ResultModal from "../common/ResultModal";

type ModifyComponentProps = {
  tno: number;
};

type Todo = {
  tno: number;
  title: string;
  writer: string;
  dueDate: string;    // date input과 맞추기 위해 string으로
  complete: boolean;
};

const initState: Todo = {
  tno: 0,
  title: "",
  writer: "",
  dueDate: "",
  complete: false,
};

const ModifyComponent = ({ tno }: ModifyComponentProps) => {
  const [todo, setTodo] = useState<Todo>(initState);
  const [result, setResult] = useState<string|null>(null);
  const { moveToList, moveToRead } = useCustomMove()

  useEffect(() => {
    getOne(tno).then((data) => {
      // 백엔드에서 오는 데이터에 맞게 필요하면 매핑
      setTodo({
        tno: data.tno,
        title: data.title,
        writer: data.writer,
        dueDate: data.dueDate ?? "",
        complete: data.complete,
      });
    });
  }, [tno]);

  const handleClickModify = () => {
    putOne(todo).then(data => {
        //console.log("modify result: " + data)
        setResult('Modified')
    })
  }
  const handleClickDelete = () => {
    deleteOne(tno).then(data => {
        //console.log("delete result:" + data)
        setResult('Deleted')
    })
  }
  const closeModal = () => {
    if(result ==='Deleted') {
        moveToList()
    } else {
        moveToRead(tno)
    }
  }

  // TITLE / DUEDATE용
  const handleChangeTodo = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTodo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // COMPLETE 셀렉트용
  const handleChangeTodoComplete = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setTodo((prev) => ({
      ...prev,
      complete: value === "Y",
    }));
  };

  return (
    <div className="border-2 border-sky-200 mt-10 m-2 p-4">

        {result ? <ResultModal title={'처리결과'} content={result} callbackFn={closeModal}></ResultModal> :<></>}

      <div className="flex justify-center mt-10">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-1/5 p-6 text-right font-bold">TNO</div>
          <div className="w-4/5 p-6 rounded-r border border-solid shadow-md bg-gray-100">
            {todo.tno}
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-1/5 p-6 text-right font-bold">WRITER</div>
          <div className="w-4/5 p-6 rounded-r border border-solid shadow-md bg-gray-100">
            {todo.writer}
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-1/5 p-6 text-right font-bold">TITLE</div>
          <input
            className="w-4/5 p-6 rounded-r border border-solid border-neutral-300 shadow-md"
            name="title"
            type="text"
            value={todo.title}
            onChange={handleChangeTodo}
          />
        </div>
      </div>

      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-1/5 p-6 text-right font-bold">DUEDATE</div>
          <input
            className="w-4/5 p-6 rounded-r border border-solid border-neutral-300 shadow-md"
            name="dueDate"
            type="date"
            value={todo.dueDate}
            onChange={handleChangeTodo}
          />
        </div>
      </div>

      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-1/5 p-6 text-right font-bold">COMPLETE</div>
          <select
            name="complete"
            className="border-2 border-solid border-neutral-300 rounded m-1 p-2"
            onChange={handleChangeTodoComplete}
            value={todo.complete ? "Y" : "N"}
          >
            <option value="Y">Completed</option>
            <option value="N">Not Yet</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end p-4">
        <button
          type="button"
          onClick={handleClickDelete}
          className="rounded p-4 m-2 text-xl w-32 text-white bg-red-500"
        >
          Delete
        </button>
        <button
          type="button"
          onClick={handleClickModify}
          className="rounded p-4 m-2 text-xl w-32 text-white bg-red-500"
        >
          Modify
        </button>
      </div>
    </div>
  );
};

export default ModifyComponent;
