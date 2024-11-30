import Table from "../components/table/Table";
import infoData from "../utils/tables/testTable/infoData";

const tableHeaderStyles = {
    backgroundColor: "#f4f4f4",
    textAlign: "left",
    fontWeight: "bold",
    padding: "10px",
  };

function Info () {
    
    return (
        <>
            <Table values={infoData} tableHeaderStyles={tableHeaderStyles} />
        </>
    )
}

export default Info;