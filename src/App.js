import React from 'react';
import { 
  Link,
  Navigate, 
  Outlet,
  Route, 
  Routes
} from "react-router-dom";

import SACHeader from "./sac-templates/sac-header";
import SACFooter from "./sac-templates/sac-footer";
import Home from "./home";



const App = () =>{
  return (
    <div className="App">
      <div className="main">


        <Routes>
          <Route element={<Layout />}>


            <Route path="/" element={<Home />} />
            <Route index element={<Home />} />


          </Route>
        </Routes>

      </div>
    </div>
  );
}



function Layout() {
   return (
     <div>
       <div id="test-banner"><span aria-hidden="true" className="fas fa-exclamation-triangle"></span><span className="sr-only">Exclamation symbol</span> This is the TEST site.  PRODUCTION site is <a href="https://apply.studyabroad.hawaii.edu/">HERE</a>. <span aria-hidden="true" className="fas fa-exclamation-triangle"></span><span className="sr-only">Exclamation symbol</span></div>

       <div className="container">
         <SACHeader />
             <Outlet />
       </div>
       <SACFooter />
     </div>
   );
 }




export default App;
