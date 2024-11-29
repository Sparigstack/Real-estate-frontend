import React, { useEffect, useState } from 'react'
import DropdownTreeSelect from 'react-dropdown-tree-select'
import 'react-dropdown-tree-select/dist/styles.css';

export default function DropdownTreeSelectBox({ data, mode, onChange, selectedValue, placeholder }) {
    const [selectedCategories, setSelectedCategories] = useState(selectedValue || []);

    useEffect(() => {
        if (selectedValue) {
            setSelectedCategories(selectedValue);
        }
    }, [selectedValue]);

    const handleChange = (currentNode, selectedNodes) => {
        const newSelectedNodes = mode == 'multiSelect' ? selectedNodes : [currentNode];
        setSelectedCategories(newSelectedNodes);
        onChange(newSelectedNodes);
    };

    return (
        <div style={{ width: '100%' }}>
            <DropdownTreeSelect
                data={data}
                onChange={handleChange}
                mode={mode}
                texts={{ placeholder: placeholder }}
                className="dropdown-tree-select"
                style={{ width: '100%' }}
                value={selectedCategories}
            />
        </div>
    )
}
