import Table from "../components/table/Table";
import infoData from "../utils/tables/testTable/infoData";
import Search from "../components/search/Search";

const tableHeaderStyles = {
    backgroundColor: "#f4f4f4",
    textAlign: "left",
    fontWeight: "bold",
    padding: "10px",
  };

function Info () {
    
    return (
        <>
            <Search />
            <Table values={infoData} tableHeaderStyles={tableHeaderStyles} />
        </>
    )
}

export default Info;