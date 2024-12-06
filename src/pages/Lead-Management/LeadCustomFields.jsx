import { Field, useFormikContext } from 'formik'
import React from 'react'

export default function LeadCustomFields({ CustomFieldData }) {
    const { values, setFieldValue } = useFormikContext();
    return (
        <div className='row fontwhite pt-5'>
            <div className='h6 ps-0 pb-3 fw-semibold'>Custom Fields</div>
            {CustomFieldData.map((item, index) => {
                return item.custom_fields_type_values_id == 1 ?
                    <div className='col-md-6 mb-4 ps-0 position-relative' key={index}>
                        <label className='custom-label'>{item.name}</label>
                        <Field type="text" className="customInput" name={item.name} autoComplete='off' />
                    </div>
                    : item.custom_fields_type_values_id == 2 ?
                        <div className='col-md-6 mb-4 ps-0 position-relative' key={index}>
                            <label className='custom-label'>{item.name}</label>
                            <Field type="textarea" rows={2} className="customInput" name={item.name} autoComplete='off' />
                        </div>
                        : item.custom_fields_type_values_id == 3 ?
                            <div className='col-md-6 mb-4 ps-0 position-relative' key={index}>
                                <label className='custom-label'>{item.name}</label>
                                <Field type="number" className="customInput" name={item.name} autoComplete='off' />
                            </div>
                            : item.custom_fields_type_values_id == 4 ?
                                <div className='col-md-6 mb-4 ps-0 position-relative' key={index}>
                                    <label className='custom-label'>{item.name}</label>
                                    <Field type="date" className="customInput reminderdate" name={item.name} autoComplete='off' />
                                </div>
                                : item.custom_fields_type_values_id == 5 ?
                                    <div className='col-md-6 mb-4 ps-0 position-relative' key={index}>
                                        <div className='font-13'>{item.name}</div>
                                        <div className='pt-2 d-flex'>
                                            {item.custom_field_structures.map((singleitem, singleindex) => {
                                                return <div className="pb-1 pe-4" key={singleindex}>
                                                    <Field
                                                        className="form-check-input me-2"
                                                        type="radio"
                                                        name={item.name}
                                                        value={singleitem.value}
                                                    />
                                                    <label className="form-check-label font-13">{singleitem.value}</label>
                                                </div>
                                            })}
                                        </div>
                                    </div>
                                    : item.custom_fields_type_values_id == 6 ?
                                        <div className='col-md-6 mb-4 ps-0 position-relative' key={index}>
                                            <div className='font-13'>{item.name}</div>
                                            <div className='pt-2 d-flex'>
                                                {item.custom_field_structures.map((singleitem, singleindex) => {
                                                    return <div className="pb-1 pe-4" key={singleindex}>
                                                        <Field
                                                            className="form-check-input me-2 normalbg"
                                                            type="checkbox"
                                                            name={item.name}
                                                            value={singleitem.value}
                                                            onChange={(e) => {
                                                                const checked = e.target.checked;
                                                                const currentValues = values[item.name] || [];
                                                                const updatedValues = checked
                                                                    ? [...currentValues, singleitem.value]
                                                                    : currentValues.filter((val) => val !== singleitem.value);
                                                                setFieldValue(item.name, updatedValues);
                                                            }}
                                                        />
                                                        <label className="form-check-label font-13">{singleitem.value}</label>
                                                    </div>
                                                })}
                                            </div>
                                        </div>
                                        :
                                        <></>
            })}
        </div>
    )
}
