import React from 'react';

export default function SACStatus() { 

  return (<>


        <div id="sac-status-info" className="alert alert-primary">
          <div className="row">
            <div role="navigation" aria-labelledby="logout-btn" className="col-12 sac-status-val">
              ADMIN
              <a id="logout-btn" href="">
                <button className="btn btn-primary sac-logout" title="logout" >
                  <span className="fas fa-sign-out-alt sac-logout" aria-hidden="true"></span> Logout
                </button>
              </a>
            </div>
          </div>
        </div>

  </>);
}
