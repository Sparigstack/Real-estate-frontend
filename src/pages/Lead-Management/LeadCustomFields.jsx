import { useFormikContext } from 'formik'
import React from 'react'

export default function LeadCustomFields({ CustomFieldData, setCustomFieldData }) {
    const { setFieldValue } = useFormikContext();
    const renderField = (item, index) => {
        const handleChange = (e) => {
            const updatedFields = CustomFieldData.map(field =>
                field.name == item.name
                    ? { ...field, value: e.target.value }
                    : field
            );
            setCustomFieldData(updatedFields);
        };

        switch (item.value_type) {
            case 1: // Text
                return (
                    <input type="text" className="customInput" name={item.name}
                        defaultValue={item.value} autoComplete='off' onChange={handleChange} />
                );

            case 2: // Textarea
                return (
                    <textarea className="customInput" name={item.name}
                        defaultValue={item.value} autoComplete='off' onChange={handleChange} />
                );

            case 3: // Number
                return (
                    <input type="number" className="customInput" name={item.name}
                        defaultValue={item.value} autoComplete='off' onChange={handleChange} />
                );

            case 4: // Date
                return (
                    <input type="date" className="customInput reminderdate" name={item.name}
                        defaultValue={item.value} autoComplete='off' onChange={handleChange} />
                );

            case 5: // Radio
                return (
                    <div className='pt-3 d-flex ps-3'>
                        {item.custom_field_structures.map((singleitem, idx) => (
                            <div className="pb-2 pe-4" key={idx}>
                                <input
                                    className="form-check-input me-2"
                                    type="radio"
                                    name={item.name}
                                    value={singleitem.id}
                                    defaultChecked={item.value == singleitem.id}
                                    onChange={handleChange}
                                />
                                <label className="form-check-label font-13 ps-0">{singleitem.value}</label>
                            </div>
                        ))}
                    </div>
                );

            case 6: // Checkbox
                return (
                    <div className='pt-3 d-flex ps-3'>
                        {item.custom_field_structures.map((multiitem, idx) => {
                            const isChecked = item.value?.includes(multiitem.id); // Check by value
                            const handleCheckboxChange = (e) => {
                                const updatedValues = e.target.checked
                                    ? [...(item.value || []), multiitem.id] // Add value
                                    : (item.value || []).filter(val => val !== multiitem.id); // Remove value

                                setFieldValue(item.name, updatedValues);
                                const updatedFields = CustomFieldData.map(field =>
                                    field.name === item.name
                                        ? { ...field, value: updatedValues }
                                        : field
                                );
                                setCustomFieldData(updatedFields);
                            };

                            return (
                                <div className="pb-1 pe-4" key={idx}>
                                    <input
                                        className="form-check-input me-2 normalbg"
                                        type="checkbox"
                                        name={item.name}
                                        value={multiitem.id}
                                        defaultChecked={isChecked}
                                        onChange={handleCheckboxChange}
                                    />
                                    <label className="form-check-label font-13">{multiitem.value}</label>
                                </div>
                            );
                        })}
                    </div>
                );

            default:
                return null;
        }
    };
    return (
        <div className='row fontwhite pt-5 px-5'>
            <div className='h6 ps-0 pb-3 fw-semibold'>Custom Fields</div>
            {CustomFieldData.map((item, index) => (
                <div className='col-md-4 mb-4 ps-0 position-relative' key={index}>
                    <label className='custom-label'>{item.name}</label>
                    {renderField(item, index)}
                </div>
            ))}
        </div>
    )
}
