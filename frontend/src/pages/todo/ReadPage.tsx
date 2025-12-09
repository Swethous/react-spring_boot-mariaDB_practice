import { createSearchParams, useNavigate, useParams, useSearchParams } from "react-router-dom";

const ReadPage = () => {
    const {tno} = useParams< {tno: string} >()
    const navigate = useNavigate()
    const [queryParams] = useSearchParams()

    const page = parseInt(queryParams.get("page") ?? "1" , 10);
    const size = parseInt(queryParams.get("size") ?? "10" , 10);

    const queryStr = createSearchParams({page :String(page), size: String(size)}).toString();

    const moveToModify = (tno: string) => {
    navigate(`/todo/modify/${tno}?${queryStr}`);
    };

    const moveToList = () => {
    navigate(`/todo/list?${queryStr}`);
    };

    return (
        <div className="text-3xl font-extrabold">
            Todo Read Page Component {tno}
            <div>
                <button onClick={() => { if (!tno) return; moveToModify(tno)}}>TestModify</button>
            </div>
            <div>
                <button onClick={() => moveToList()}>Test List</button>
            </div>
        </div>
    )
}

export default ReadPage;