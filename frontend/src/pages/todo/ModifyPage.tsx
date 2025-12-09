import { useNavigate, useParams  } from "react-router-dom";


const ModifyPage = () => {
    const navigate = useNavigate();
    const { tno } = useParams<{tno: string}> ();

    const moveToRead = () => {
        if(!tno) return;
        navigate(`/todo/read/${tno}`)
    }
    const moveToList = () => {
        navigate(`/todo/list`)
    }

    return (
        <div className="text-3xl font-extrabold">
            Todo Modify page
        </div>
    )
}

export default ModifyPage;