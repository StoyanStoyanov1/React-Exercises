import { useLocation } from "react-router-dom";

import Table from "../components/table/Table";
import infoData from "../utils/tables/testTable/infoData";

function Info () {
    const location = useLocation();
    const path = location.pathname;
    const typeTable = path.substring(path.lastIndexOf("/") + 1);

    return (
        <>
            <Table values={infoData}  typeTable={typeTable}/>
        </>
    )
}

export default Info;