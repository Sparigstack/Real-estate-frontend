import React from 'react'

export default function ExistingFields() {
    const ExistingFields = [
        { name: 'Name', type: 'Small Text' },
        { name: 'Contact No', type: 'Small Text' },
        { name: 'Source', type: 'Single Selection' },
        { name: 'Status', type: 'Single Selection' },
        { name: 'Email', type: 'Small Text' },
        { name: 'Notes', type: 'Long Text' },
    ];
    return (
        <div>
            <div className='GridHeader mt-3'>
                <div className='row'>
                    <div className='col-md-6'>
                        Name
                    </div>
                    <div className='col-md-6'>
                        Type
                    </div>
                </div>
            </div>
            <div className="parent-container">
                <div className=''>
                    {ExistingFields.map((item, index) => {
                        return <div className='row GridData' key={index}>
                            <div className='col-md-6'>
                                <label>{item.name}</label>
                            </div>
                            <div className='col-md-6'>{item.type}</div>
                        </div>
                    })
                    }
                </div>
            </div>
        </div>
    )
}
