import React from 'react';
import '../Styles/Output.css'



export default function Output(props){
 
 
          return (
         <div className='output-task'>  
            <div className='task'>
                 <p>{props.task}</p>
            </div>     
                 
                <button className='delete-btn' onClick={()=>{
                    props.onSelect(props.id)
                }}>X</button>
            
         </div>
    );
 

}
