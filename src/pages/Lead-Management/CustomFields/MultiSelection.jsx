import React, { useState } from 'react'
import Images from '../../../utils/Images';

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
        <div className="col-12 mb-3 mt-2 px-0">
            <label className='fw-semibold py-2 font-13'>Add options for Multi Selection</label>
            {multiSelectionOptions.map((option, index) => (
                <div key={index} className='d-flex align-items-center my-2 position-relative'>
                    <label className='input-labels'>{`Option ${index + 1}`}</label>
                    <input
                        type="text"
                        className="custom-inputs me-2 p-2"
                        value={option}
                        onChange={(e) => handleMultiOptionChange(index, e.target.value)}
                    />
                    <img src={Images.remove_options} className='iconsize ps-2 text-end cursor-pointer' onClick={() => handleMultiRemoveOption(index)} />
                </div>
            ))}

            <div className='col-12 text-center'>
                <label className='cursor-pointer d-flex align-items-center justify-content-center' onClick={handleAddOption} style={{ color: "black" }}>
                    <img src={Images.blackaddicon} className='iconsize pe-1' />
                    <label className='cursor-pointer'>Add New Option</label>
                </label>
            </div>
            <label className='text-danger'>{requiredMsg}</label><br />
            <label className='text-danger'>{errorMsg}</label>
        </div>
    )
}
