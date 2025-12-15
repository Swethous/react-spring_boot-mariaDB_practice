import { useState } from "react";
import { postAdd } from "../../api/todoApi";
import ResultModal from "../../components/common/ResultModal";
import useCustomMove from "../../hooks/useCustomMove";

const initState = {
    title: '',
    writer: '',
    dueDate: ''
}
const AddCompoent = () => {
    const [todo, settodo] = useState({...initState})
    const [result, setresult] = useState(null)
    const {moveToList} = useCustomMove()

    const handleChangeTodo = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name , value } = e.currentTarget;
        settodo(prev => ({
            ...prev, [name]: value,
        }))
    }

    const handleClickAdd = () => {
        postAdd(todo)
            .then(result => {
                setresult(result.TNO)
                settodo({...initState})
            }).catch(e=> {
                console.error(e)
            })
    }
    const closeModal = () => {
        setresult(null)
        moveToList()
    }

    return (
        <div className="border-2 border-sky-200 mt-10 m-2 p-4">
            
            {result ? <ResultModal title={'Add Result'} content={`New ${result}Added`} callbackFn={closeModal}/>: <></>}

            <div className="flex justify-center">
                <div className="relative mb-4 flex w-full flex-wrap items-stretch">
                    <div className="w-1/5 p-6 text-right font-bold">TITLE</div>
                    <input type="text" className="w-4/5 p-6 rounded-r border border-solid border-neutral-500 shadow-md" name="title" value={todo.title} onChange={handleChangeTodo} />
                </div>
                
            </div>
            <div className="flex justify-center">
                <div className="relative mb-4 flex w-full flex-wrap items-stretch">
                    <div className="w-1/5 p-6 text-right font-bold">WRITER</div>
                    <input type="text" className="w-4/5 p-6 rounded-r border border-solid border-neutral-500 shadow-md" name="writer" value={todo.writer} onChange={handleChangeTodo} />
                </div>
            </div>
            <div className="flex justify-center">
                <div className="relative mb-4 flex w-full flex-wrap items-stretch">
                    <div className="w-1/5 p-6 text-right font-bold">DUEDATE</div>
                    <input type="date" className="w-4/5 p-6 rounded-r border border-solid border-neutral-500 shadow-md" name="dueDate" value={todo.dueDate} onChange={handleChangeTodo} />
                </div>
            </div>
            <div className="flex justify-end">
                <div className="relative mb-4 flex p-4 flex-wrap items-stretch">
                    <button type="button" className="rounded p-4 w-36 bg-blue-500 text-xl text-white" onClick={handleClickAdd} >
                        ADD
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddCompoent;