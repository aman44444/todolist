import React, { useState } from 'react';
import '../Styles/Input.css';
import  Output from './Output';
import TitleName from './Title';
import AlarmClock from './Alarm';




export default function Input() {

    const [task, setTask] = useState("")
    const [data, setData] = useState([])
    const [title,setTitle] = useState("");
    const [titleData,setTitleData] = useState([]);


    const titleValue = (e) => {
        setTitle(e.target.value);
    }

    const titleHandler = (e) =>{
        e.preventDefault();
        setTitleData([title]);
    }
    
    const onChangeHandler = (e) => {
        setTask(e.target.value);
        setTitle('')

    }

    const taskHandler = (e) => {
        e.preventDefault();
        const newData = task;
        setData([newData,...data])
         setTask('');
    }

    const deleteItem = (a) => {
        const finalData = data.filter((curEle, index) => {
            return index!==a;
        })
        setData(finalData);
    }


    return (
        <>

            <div className="form-div">
                <form className='form'>
                    <div className='title-div'>
                        <input type="text" placeholder='Title' id="title-input" value={title} onChange={titleValue} />
                        <button id='title-button'  onClick={titleHandler}>TITLE</button>
                    </div>
                    <div className='task-div'>
                        <input id='task-input' type="text" placeholder='Type Here...' value={task} onChange={onChangeHandler} />
                        <button id="task-button" onClick={taskHandler}>ADD</button>
                    </div>
                   
                </form>


            </div>
         <div className='container'>
          <div className='task-container'>
                {
                   titleData.map((value,index)=>(
                    <TitleName
                      id={index}
                      key={index}
                      title ={value}
                    /> 
                   ))
                  
                }
             
    
            {
            data.map((value, index) => (
                        <Output
                           id={index}
                            key={index}
                            
                            task={value}
                            onSelect={deleteItem}
                        />
                    ))
                    

                }
                 
            
            </div>
            <div className='alarm-container'>
              
            {
            data.map((value, index) => (
                        <AlarmClock
                           id={index}
                            key={index}
                            
                            alarmTime={value}
                            onSelect={deleteItem}
                        />
                    ))

                }
            </div>


         </div>
        </>
    );
}