import { useNavigate, useParams  } from "react-router-dom";
import ModifyComponent from "../../components/todo/ModifyComponent";

const ModifyPage = () => {
    const navigate = useNavigate();
    const params = useParams<{tno: string}> ();
    const tno = params.tno ? Number(params.tno) : NaN;

    const moveToRead = () => {
        if(!tno) return;
        navigate(`/todo/read/${tno}`)
    }
    const moveToList = () => {
        navigate(`/todo/list`)
    }

    return (
        <div className="p-4 w-full bg-white">
        <div className="text-3xl font-extrabold">
            Todo Modify page
        </div>
        <ModifyComponent tno={tno} />
        </div>
    )
}

export default ModifyPage;