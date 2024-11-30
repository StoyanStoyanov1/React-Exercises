import Table from "../components/table/Table";
import infoData from "../utils/tables/testTable/infoData";

function Info () {
    
    const tableHeaderStyles = {
        backgroundColor: "#fff",
        textAlign: "left",
        fontWeight: "bold",
        padding: "10px",
      };


    return (
        <>
            <Table values={infoData} tableHeaderStyles={tableHeaderStyles} />
        </>
    )
}

export default Info;