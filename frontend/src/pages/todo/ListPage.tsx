import { useSearchParams } from "react-router-dom";

const ListPage = () => {

    const [queryParams] = useSearchParams()

    const page = parseInt(queryParams.get("page") ?? "1" , 10);
    const size = parseInt(queryParams.get("size") ?? "10" , 10);

    return (
        <div className="p-4 w-full bg-white">
            <div className="text-3xl font-extrabold">
                Todo List page Component {page} --- {size}
            </div>
        </div>
    )
}

export default ListPage;