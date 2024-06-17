import React from 'react';
import '../Styles/Output.css'


const Output =(props) => {
 
    return (
         <div className='output-task'>  
            <div className='task-number'>{props.number}.</div>
            <div className='task'>
                 <p>{props.task}</p>
            </div>     
            <button className='delete-btn' 
            onClick={()=>{
                props.onSelect(props.id)
                }}>
                    X
                </button>
            
         </div>
    );
}

export default Output;