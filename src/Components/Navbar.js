import React from 'react';
import '../Styles/Navbar.css';

 const Navbar = () => {
     return (
        <>
        <nav className = 'navbarContainer'>
            <div className ='heading'>
                <div>
                  <h2>TODOIST</h2>
                </div>
                <div>
                  <span className='arrow'></span>
                </div>
               <div className='mode-container'>
                 <button className='button'>
                   Mode
                 </button>
               </div>
            </div>

         </nav>
        </>
     )

}

export default Navbar;