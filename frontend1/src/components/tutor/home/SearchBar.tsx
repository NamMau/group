const SearchBar = () => {
    return (
      <div className="relative">
        <input
          type="text"
          placeholder="Search..."
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300"
        />
        <span className="absolute right-3 top-2.5 text-gray-500">🔍</span>
      </div>
    );
  };
  export default SearchBar;