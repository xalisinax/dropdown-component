import React, { ReactNode, useEffect, useRef, useState } from "react";
import "./dropdown.scss";
interface Option {
  value: string | number;
  label: string;
  icon?: ReactNode;
}
interface DropdownProps {
  initialOptions: Option[];
  placeholder: string;
  allowCreate?: boolean;
  value: Option[];
  onChange?: (values: Option[]) => void;
}

function Dropdown({ initialOptions = [], placeholder, allowCreate = false, value = [], onChange }: DropdownProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedOptions, setSelectedOptions] = useState<Option[]>(value);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [options, setOptions] = useState<Option[]>(initialOptions);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const filteredOptions = options.filter((option) => option.label.toLowerCase().includes(searchTerm.toLowerCase()));

  const toggleOption = (option: Option) => {
    if (selectedOptions.some((selected) => selected.value === option.value)) {
      setSelectedOptions(selectedOptions.filter((item) => item.value !== option.value));
    } else {
      setSelectedOptions([...selectedOptions, { value: option.value, label: option.label }]);
      setSearchTerm("");
    }
  };

  const removeTag = (value: string | number) => {
    setSelectedOptions(selectedOptions.filter((option) => option.value !== value));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchTerm.trim() && allowCreate) {
      const exactMatch = options.find((option) => option.label.toLowerCase() === searchTerm.toLowerCase());

      if (!exactMatch) {
        const newOption: Option = {
          value: searchTerm.toLowerCase().replace(/\s+/g, "-"),
          label: searchTerm.trim(),
        };

        setOptions([...options, newOption]);
        toggleOption(newOption);
      } else {
        toggleOption(exactMatch);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  useEffect(() => onChange!(selectedOptions), [selectedOptions]);

  return (
    <div className={`multi-select-dropdown ${isOpen ? "dropdown-open" : ""}`} ref={dropdownRef}>
      <div className="search-container">
        <input
          ref={searchInputRef}
          type="text"
          className="search-input"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
        />
        <div className="dropdown-indicator">{isOpen ? "▲" : "▼"}</div>
      </div>

      <div className="selected-tags-container">
        {selectedOptions.map((option) => (
          <span key={option.value} className="tag">
            {option.label}
            <button
              type="button"
              className="tag-remove"
              onClick={(e) => {
                e.stopPropagation();
                removeTag(option.value);
              }}
            >
              ×
            </button>
          </span>
        ))}
      </div>

      {isOpen && (
        <div className="dropdown-options">
          <ul>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <li
                  key={option.value}
                  onClick={() => toggleOption(option)}
                  className={selectedOptions.some((selected) => selected.value === option.value) ? "selected" : ""}
                >
                  {option.icon ? (
                    <div>
                      {option.label}
                      {option.icon}
                    </div>
                  ) : (
                    option.label
                  )}

                  {selectedOptions.some((selected) => selected.value === option.value) && <span className="checkmark">✓</span>}
                </li>
              ))
            ) : (
              <li className="no-options">
                {allowCreate && searchTerm.trim() ? (
                  <span>
                    Press <strong>Enter</strong> to add "{searchTerm.trim()}"
                  </span>
                ) : (
                  "No options available"
                )}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export { Dropdown };
export type { DropdownProps, Option };
