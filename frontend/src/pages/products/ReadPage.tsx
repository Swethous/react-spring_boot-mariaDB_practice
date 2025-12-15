import { useParams } from "react-router-dom";
import ReadComponent from "../../components/products/ReadComponent";

const ReadPage = () => {
    const {pno} = useParams<{pno: string}>()
    if(!pno) return null;
    const pnoNumber = Number(pno);

    return (
        <div className="p-4 w-full bg-white">
            <div className="text-3xl font-extrabold">
                Products Read page
            </div>

            <ReadComponent pno={pnoNumber}></ReadComponent>
        </div>
    )
}

export default ReadPage;