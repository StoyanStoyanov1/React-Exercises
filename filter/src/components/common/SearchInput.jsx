function SearchInput() {
  return (
    <div className="flex items-center border border-gray-300 rounded-md ">
      <input
        type="text"
        placeholder="Search Product"
        className="flex-grow border-none outline-none px-3 py-1.5"
      />
      <button className="bg-transparent border-none p-2 cursor-pointer text-gray-500 hover:text-gray-700">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </button>
    </div>
  );
}

export default SearchInput;
