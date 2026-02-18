import React from 'react';
import '../Styles/Navbar.css';

 const Navbar = () => {
     return (
        <>
        <nav className = 'navbarContainer'>
            <div className ='heading'>
                <h2>TODOIST</h2>
            </div>
            <div className='nav-right'>
               <button>
                  Mode
               </button>
               <div className='line'></div>
            </div>
         </nav>
        </>
     )

}

export default Navbar;