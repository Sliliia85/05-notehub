import css from "./SearchBox.module.css";  
import React, { useState } from "react";

interface SearchBoxProps {
  onSearch: (query: string) => void;
}
export default function SearchBox({ onSearch }: SearchBoxProps) { 
     const [value, setValue] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    onSearch(newValue);
  };
    return (
        <input
  className={css.input}
  type="text"
            placeholder="Search notes"
              value={value}
      onChange={handleChange}
 />
    );
}
