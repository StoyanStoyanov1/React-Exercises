import React from 'react';
import FilterButton from '../templates/FilterButtons';
import SearchInput from '../templates/SearchInput';

function SearchAndFilter () {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', borderRadius: '4px' }}>
        
      </div>
    <SearchInput />
     <FilterButton />

    </div>
  );
};

export default SearchAndFilter;
