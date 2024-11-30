import Table from "../components/table/Table";
import infoData from "../utils/tables/testTable/infoData";
import SearchInput from "../components/templates/SearchInput";
import FilterButton from "../components/templates/FilterButtons";

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
                <FilterButton />
        
            </div>
                <Table values={infoData} tableHeaderStyles={tableHeaderStyles} />
        </div>
    )
}

export default Info;