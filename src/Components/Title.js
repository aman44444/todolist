import React from 'react';
import '../Styles/Title.css';

export default function TitleName(props){
    return(
        <div className="title-div">
             <p>{props.title}</p>
        </div>
      );
}