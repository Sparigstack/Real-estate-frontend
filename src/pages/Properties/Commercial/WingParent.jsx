import React, { useState } from 'react'
import StepProgressBar from '../../../components/StepProgressBar';
import AddWingComp from './AddWingComp';

export default function WingParent({ totalSteps }) {
    const [currentStep, setCurrentStep] = useState(1);
    return (
        <>
            <div className='pt-3'>
                <StepProgressBar currentStep={currentStep} totalSteps={totalSteps} />
            </div>
            <AddWingComp />
        </>
    )
}
