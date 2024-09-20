import React from 'react'
import '../styles/progressbar.css'

export default function StepProgressBar({ currentStep, totalSteps }) {
    const steps = Array.from({ length: totalSteps }, (_, index) => index + 1)
    return (
        <div className="stepper">
            <div className="stepper-container">
                <div className="stepper-line">
                    <div className="stepper-progress" style={{ width: `${(currentStep / totalSteps) * 100}%` }} />
                </div>
                <div className="stepper-steps">
                    {steps.map((step) => (
                        <div key={step} className={`stepper-step  ${step < currentStep ? 'completed' : ''} ${step == currentStep ? 'active' : ''}`}>
                            {`${step} Wing`}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
