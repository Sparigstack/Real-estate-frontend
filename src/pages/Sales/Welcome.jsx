import React, { useCallback, useState } from 'react'
import { debounce } from 'lodash';
import AddWings from './AddWings';
import Loader from '../../components/loader/Loader';

export default function Welcome() {
    const [loading, setloading] = useState(false);
    const [isWings, setIsWings] = useState(0);
    const handleAddWings = useCallback(
        debounce((value) => {
            setIsWings(1)
            setloading(false);
        }, 1000),
        []
    );
    return (
        <>
            {loading && <Loader runningcheck={loading} />}
            {isWings == 0 ?
                <div className='welcomediv'>
                    <h1 className='fw-bold'>Welcome, to the RealEstate..!!</h1>
                    <h6 className='pt-4'>For view more please enter the wings details</h6>
                    <button type='button' className='WhiteBtn mt-4 px-4' onClick={(e) => { setloading(true); handleAddWings(e) }}>
                        Add Wing Details
                    </button>
                </div>
                :
                <AddWings setloading={setloading} />
            }
        </>
    )
}
