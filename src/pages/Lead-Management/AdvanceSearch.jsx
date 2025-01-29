import React, { useEffect, useState } from 'react'
import useCommonApiService from '../../hooks/useCommonApiService';
import useApiService from '../../hooks/useApiService';
import useProperty from '../../hooks/useProperty';

export default function AdvanceSearch({ utils, closepopup, setUtils, applyFilters }) {
    const { getLeadStatus, getLeadTags } = useCommonApiService();
    const { getAPIAuthKey } = useApiService();
    const { schemeId } = useProperty();
    const [leadStatuses, setleadStatuses] = useState([]);
    const [allTags, setAllTags] = useState([]);
    const [customFieldData, setCustomFieldData] = useState([]);
    const [SingleMultiCustomFieldData, setSingleMultiCustomFieldData] = useState([]);
    const [customFieldValueType, setcustomFieldValueType] = useState('');
    useEffect(() => {
        setUtils({
            ...utils,
            statusid: null,
            customfieldid: null,
            tagid: null,
            customfieldvalue: null,
        });
        const fetchStatus = async () => {
            const sources = await getLeadStatus();
            setleadStatuses(sources)
        }
        const getTags = async () => {
            const sources = await getLeadTags();
            setAllTags(sources)
        }
        const getAllCustomFields = async () => {
            try {
                const result = await getAPIAuthKey(`/get-custom-fields/` + schemeId);
                if (!result) {
                    throw new Error('Something went wrong');
                }
                const responseRs = JSON.parse(result);
                setCustomFieldData(responseRs);
            }
            catch (error) {
                setLoading(false);
                console.error(error);
            }
        }
        getAllCustomFields();
        fetchStatus();
        getTags();
    }, []);
    useEffect(() => {
        setUtils({ ...utils, customfieldvalue: null });
    }, [customFieldValueType]);

    const handleCustomFieldChange = (item) => {
        setUtils({ ...utils, customfieldid: item.id, customfieldvalue: "" });
        setcustomFieldValueType(item.value_type);
        if (item.value_type == 5 || item.value_type == 6) {
            getSingleMultiCustomFields(item.id)
        }

    }
    const getSingleMultiCustomFields = async (customfieldid) => {
        try {
            const result = await getAPIAuthKey(`/fetch-single-multi-custom-field-values/` + schemeId + '/' + customfieldid);
            if (!result) {
                throw new Error('Something went wrong');
            }
            const responseRs = JSON.parse(result);
            setSingleMultiCustomFieldData(responseRs);
        }
        catch (error) {
            setLoading(false);
            console.error(error);
        }
    }
    const handleCheckboxChange = (e, multiitem) => {
        const isChecked = e.target.checked;
        const currentValues = utils.customfieldvalue ? utils.customfieldvalue.split(',') : [];

        let updatedValues;
        if (isChecked) {
            updatedValues = [...currentValues, multiitem.id.toString()];
        } else {
            updatedValues = currentValues.filter(val => val !== multiitem.id.toString());
        }

        setUtils({ ...utils, customfieldvalue: updatedValues.join(',') });
    };


    return (
        <>
            <div className='row'>
                <div className='col-12'>
                    <label className='fw-semibold upgradeplan_link font-13'>Lead Status:</label>
                </div>
                <div className='col-12 d-flex flex-wrap pt-1'>
                    {leadStatuses.length > 0 && (
                        leadStatuses.map((item, index) => {
                            return <label className={`status_boxes ${item.id == utils.statusid && 'active_status_boxes'} cursor-pointer font-12 me-2 my-1 px-2`} key={index}
                                onClick={(e) => setUtils({ ...utils, statusid: item.id })}>
                                {item.name}
                            </label>
                        })
                    )}
                </div>
            </div>
            <hr />
            <div className='row'>
                <div className='col-12'>
                    <label className='fw-semibold upgradeplan_link font-13'>Tag:</label>
                </div>
                <div className='col-12 d-flex flex-wrap pt-1'>
                    {allTags.length > 0 ? (
                        allTags.map((tag, tagindex) => {
                            return <label className={`status_boxes ${tag.id == utils.tagid && 'active_status_boxes'} cursor-pointer font-12 me-2 my-1 px-2`}
                                key={tagindex}
                                onClick={(e) => setUtils({ ...utils, tagid: tag.id })}>
                                {tag.name.charAt(0).toUpperCase() + tag.name.slice(1)}
                            </label>
                        })
                    ) : <label>No Tags Found.</label>}
                </div>
            </div>
            <hr />
            <div className='row'>
                <div className='col-12'>
                    <label className='fw-semibold upgradeplan_link font-13'>Filter By Custom Fields</label>
                </div>
                <div className='col-12 d-flex flex-wrap pt-1'>
                    {customFieldData.length > 0 ? (
                        customFieldData.map((item, index) => {
                            return <label className={`status_boxes ${item.id == utils.customfieldid && 'active_status_boxes'} cursor-pointer font-12 me-2 my-1 px-2`}
                                key={index}
                                onClick={(e) => handleCustomFieldChange(item)}>
                                {item.name}
                            </label>
                        })
                    ) : <label>No Custom Field Found.</label>}
                </div>
            </div>
            <div className='row py-3 '>
                <div className='col-md-8'>
                    {customFieldValueType == 1 || customFieldValueType == 2 || customFieldValueType == 3 ?
                        <input type="text" className="custom-inputs" placeholder='Search..' name="searchfield"
                            autoComplete='off' value={utils.customfieldvalue} onChange={(e) => setUtils({ ...utils, customfieldvalue: e.target.value })} />
                        : customFieldValueType == 4 ?
                            <input type="date" className="custom-inputs" name="searchfield"
                                autoComplete='off' value={utils.customfieldvalue} onChange={(e) => setUtils({ ...utils, customfieldvalue: e.target.value })} />
                            : customFieldValueType == 5 ?
                                <div className='pt-3 d-flex ps-3'>
                                    {SingleMultiCustomFieldData.map((singleitem, idx) => (
                                        <div className="pb-2 pe-4" key={idx}>
                                            <input
                                                className="form-check-input me-2"
                                                type="radio"
                                                name={"singleitemselection"}
                                                value={singleitem.id}
                                                onChange={(e) => setUtils({ ...utils, customfieldvalue: singleitem.id })}
                                            />
                                            <label className="form-check-label font-13 ps-0">
                                                {singleitem.value}
                                            </label>
                                        </div>
                                    ))}
                                </div> :
                                customFieldValueType == 6 ?
                                    <div className='pt-3 d-flex ps-3'>
                                        {SingleMultiCustomFieldData.map((singleitem, idx) => {
                                            return <div className="pb-2 pe-4" key={idx}>
                                                <input
                                                    className="form-check-input me-2 normalbg"
                                                    type="checkbox"
                                                    name={"multiitemselection"}
                                                    value={singleitem.id}
                                                    onChange={(e) => handleCheckboxChange(e, singleitem)}
                                                />
                                                <label className="form-check-label font-13 ps-0">
                                                    {singleitem.value}
                                                </label>
                                            </div>
                                        })}
                                    </div>
                                    : null
                    }
                </div>
            </div>

            <div className='col-12 pt-5 text-center'>
                <button type='button' className="CancelBtn me-2" onClick={closepopup}>
                    Cancel
                </button>
                <button type='submit' className="SuccessBtn" onClick={(e) => { applyFilters(); closepopup() }}>
                    Apply Filter
                </button>
            </div>
        </>
    )
}
