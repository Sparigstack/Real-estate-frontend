import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react'

export default function LeadTags({ tags, setTags }) {
    const [inputValue, setInputValue] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputValue(value);
        if (value) {
            const filteredSuggestions = tags.filter((tag) =>
                tag.toLowerCase().includes(value.toLowerCase())
            );
            setSuggestions(filteredSuggestions);
        } else {
            setSuggestions([]);
        }
    };
    const handleArrowDown = () => {
        if (selectedIndex < suggestions.length - 1) {
            setSelectedIndex(selectedIndex + 1);
        }
    };

    const handleArrowUp = () => {
        if (selectedIndex > 0) {
            setSelectedIndex(selectedIndex - 1);
        }
    };

    const handleEnter = (e) => {
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
            addTag(suggestions[selectedIndex]);
        } else if (inputValue) {
            addTag(inputValue);
        }

        setInputValue("");
        setSuggestions([]);
        setSelectedIndex(-1);
    };

    const addTag = (tag) => {
        if (!tags.includes(tag)) {
            setTags([...tags, tag]);
        }
    };
    const deleteTag = (index) => {
        const updatedTags = tags.filter((_, i) => i !== index);
        setTags(updatedTags);
    };
    return (
        <>
            <div className='row fontwhite'>
                <div className='h6 ps-0 pb-3 fw-semibold'>Tags</div>
            </div>
            <div className='fontwhite row position-relative'>
                <div className='col-md-6 ps-0 position-relative'>
                    <label className='custom-label'>Add Tag</label>
                    <input type="text" className="customInput" name='name' autoComplete='off'
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={(e) => {
                            if (e.key === "ArrowDown") handleArrowDown();
                            if (e.key === "ArrowUp") handleArrowUp();
                            if (e.key === "Enter") handleEnter(e);
                        }} />
                </div>
                <div className="col-md-6 tags-list fontwhite">
                    {tags.map((tag, index) => (
                        <label className='tags_label m-1' key={index}>
                            {tag}
                            <FontAwesomeIcon icon={faXmark} className='ps-1 cursor-pointer'
                                onClick={() => deleteTag(index)} />
                        </label>
                    ))}
                </div>
                {suggestions.length > 0 && (
                    <div className="suggestion-box">
                        {suggestions.map((suggestion, index) => (
                            <div key={suggestion}
                                className={`py-1 suggestion-item ${index === selectedIndex ? "selected_tag" : ""}`}
                                onMouseDown={() => {
                                    addTag(suggestion);
                                    setInputValue("");
                                    setSuggestions([]);
                                }}>
                                {suggestion}
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </>
    )
}
