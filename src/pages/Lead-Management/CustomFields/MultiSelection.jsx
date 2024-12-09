import React, { useState } from 'react'

export default function MultiSelection({ multiSelectionOptions, setrequiredMsg, setMultiSelectionOptions, requiredMsg }) {
    const [errorMsg, seterrorMsg] = useState('');
    const handleAddOption = () => {
        seterrorMsg("");
        setrequiredMsg("");
        setMultiSelectionOptions([...multiSelectionOptions, '']);
    };

    const handleMultiOptionChange = (index, value) => {
        const updatedOptions = [...multiSelectionOptions];
        updatedOptions[index] = value;
        setMultiSelectionOptions(updatedOptions);
    };

    const handleMultiRemoveOption = (index) => {
        if (multiSelectionOptions.length > 1) {
            const updatedOptions = multiSelectionOptions.filter((_, i) => i !== index);
            setMultiSelectionOptions(updatedOptions);
        } else {
            seterrorMsg("At least one option is required")
        }
    };
    return (
        <div className="col-md-8 offset-md-2 mb-3 px-0">
            <div className='white_boxes p-2 text-center' style={{ backgroundColor: "transparent" }}>
                <b className='pt-2'>Add options for Multi Selection</b>
                {multiSelectionOptions.map((option, index) => (
                    <div key={index} className='d-flex align-items-center my-2'>
                        <input
                            type="text"
                            className="custom-inputs me-2 p-2"
                            placeholder={`Option ${index + 1}`}
                            value={option}
                            onChange={(e) => handleMultiOptionChange(index, e.target.value)}
                        />
                        <button type="button" className="CancelBtn p-2 font-12 formlabel" onClick={() => handleRemoveOption(index)}
                            style={{ border: "1px solid #ced4da", borderRadius: "6px", color: "#4A4A4A" }}>
                            Remove
                        </button>
                    </div>
                ))}
                <label className='text-danger'>{requiredMsg}</label><br />
                <label className='text-danger'>{errorMsg}</label>
                <div className='col-12 text-center'>
                    <label className='text-decoration-underline cursor-pointer my-2' onClick={handleAddOption}>
                        Add New Option
                    </label>
                </div>
            </div>
        </div>
    )
}
