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
    
    return (
        <div >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        
                <SearchInput />
                <FilterButton infoTable={infoTable}/>
        
            </div>
                <Table values={infoData} tableHeaderStyles={tableHeaderStyles} infoTable={infoTable}/>
        </div>
    )
}

export default Info;