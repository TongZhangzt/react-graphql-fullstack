import * as React from 'react';

interface SearchBarProps {
  placeholder?: string;
}

const SearchBar: React.FunctionComponent<SearchBarProps> = props => {
  return (
    <div className="search-bar">
      <input placeholder={props.placeholder || '搜索'} />
      <i className="iconfont icon-search"></i>
    </div>
  );
};

export default SearchBar;
