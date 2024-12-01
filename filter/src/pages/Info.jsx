import { useNavigate } from "react-router-dom";

import Table from "../components/table/Table";
import infoData from "../utils/tables/testTable/infoData";
import SearchInput from "../components/common/SearchInput";
import FilterButton from "../components/common/FilterButton";
import infoTable from "../utils/tables/testTable/infoTable";

const tableHeaderStyles = {
    backgroundColor: "#f4f4f4",
    textAlign: "left",
    fontWeight: "bold",
    padding: "10px",
  };



function Info () {
    const navigate = useNavigate();

    const filterTable = infoTable.filter((info) => info.field !== 'id')
    
    const handleFilter = (filter) => {
        const queryParams = new URLSearchParams(filter).toString();

         navigate(`/info?${queryParams}`);
    }

    return (
        <div >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        
                <SearchInput />
                <FilterButton infoTable={filterTable} handleFilter={handleFilter}/>
        
            </div>
                <Table values={infoData} tableHeaderStyles={tableHeaderStyles} infoTable={infoTable}/>
        </div>
    )
}

export default Info;