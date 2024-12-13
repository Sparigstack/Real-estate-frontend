import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react'

export default function LeadTags({ tags, setTags, allTags }) {
    const [inputValue, setInputValue] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const tagNames = allTags?.map(tag => tag.name);
    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputValue(value);
        if (value) {
            const filteredSuggestions = tagNames.filter(
                (tag) => tag.toLowerCase().includes(value.toLowerCase())
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
        } else if (inputValue.trim()) {
            addTag(inputValue.trim());
        }
        clearInputAndSuggestions();
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

    const clearInputAndSuggestions = () => {
        setInputValue("");
        setSuggestions([]);
        setSelectedIndex(-1);
    };
    return (
        <div className='row fontwhite pt-4 px-5'>
            <div className='h6 ps-0 pb-3 fw-semibold'>Tags</div>
            <div className='fontwhite row position-relative'>
                <div className='col-md-4 ps-0 position-relative'>
                    <label className='custom-label'>Add Tag</label>
                    <input
                        type="text"
                        className="customInput"
                        name="name"
                        autoComplete="off"
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={(e) => {
                            if (e.key === "ArrowDown") handleArrowDown();
                            if (e.key === "ArrowUp") handleArrowUp();
                            if (e.key === "Enter") handleEnter(e);
                        }}
                    />
                </div>
                {tags.length > 0 && (
                    <div className="col-md-8 d-flex tags-list fontwhite p-1"
                        style={{ border: "0.5px solid #777894", borderRadius: "5px", flexWrap: "wrap" }}>
                        {tags.map((tag, index) => (
                            <label className="tags_label m-1" key={index} >
                                <label className='pe-1'>
                                    {tag.charAt(0).toUpperCase() + tag.slice(1)}
                                </label>
                                <FontAwesomeIcon
                                    icon={faXmark}
                                    className="cursor-pointer  p-1 fw-bold"
                                    onClick={() => deleteTag(index)}
                                />
                            </label>
                        ))}
                    </div>
                )}
                {suggestions.length > 0 && (
                    <div className="suggestion-box position-absolute top-100">
                        {suggestions.map((suggestion, index) => (
                            <div key={suggestion}
                                className={`py-1 suggestion-item ${index === selectedIndex ? "selected_tag" : ""}`}
                                onMouseDown={() => {
                                    addTag(suggestion);
                                    clearInputAndSuggestions();
                                }}>
                                {suggestion}
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>

    )
}
