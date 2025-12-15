import { Outlet, useNavigate } from "react-router-dom"
import BasicLayout from "../../layouts/BasicLayout"

const Indexpage = () => {

    const navigate = useNavigate()
    const handleClickList = (() => {
        navigate("/products/list");
    })
    const handleClickAdd = (() => {
        navigate("/products/add");
    })


    return (
        <BasicLayout>
            <div className="w-full flex m-2 p-2">
                <div className="text-x1 m-1 p-2 w-20 font-extrabold text-center underline cursor-pointer" onClick={handleClickList}>LIST</div>
                <div className="text-x1 m-1 p-2 w-20 font-extrabold text-center underline cursor-pointer" onClick={handleClickAdd}>ADD</div>
            </div>
            <div className="flex flex-wrap w-full">
                <Outlet/>
            </div>
        </BasicLayout>
    )
}

export default Indexpage;