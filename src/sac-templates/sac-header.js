import React from 'react';
import SACUHMSealImg from './images/cropped-website-headerc-seal-only.png';



export default function SACHeader() { 

  return (<>

        <header id="page-header" role="banner">
          <div id="skiptocontent">
            <a href="#main">skip to main content</a>
          </div>
          <img src={SACUHMSealImg}  alt="University of Hawaii at Manoa Seal" />
          <div className="site-id-text">
            <span>University of Hawai&#699;i at M&#257;noa</span>
            <span>Study Abroad Center</span>
          </div>
        </header>

  </>);


}
