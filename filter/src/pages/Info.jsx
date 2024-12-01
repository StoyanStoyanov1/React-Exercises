import { useNavigate } from "react-router-dom";

//utils
import infoTable from "../utils/tables/testTable/infoTable";
import infoData from "../utils/tables/testTable/infoData";

//components
import Table from "../components/table/Table";
import SearchInput from "../components/common/SearchInput";
import FilterButton from "../components/common/FilterButton";

function Info() {
  const navigate = useNavigate();

  const filterTable = infoTable.filter((info) => info.field !== "id");

  const handleFilter = (filter) => {
    const queryParams = new URLSearchParams(filter).toString();
    navigate(`/info?${queryParams}`);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex items-center gap-4 mb-6">
        <SearchInput />
        <FilterButton infoTable={filterTable} handleFilter={handleFilter} />
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <Table
          values={infoData}
          infoTable={infoTable}
        />
      </div>
    </div>
  );
}

export default Info;