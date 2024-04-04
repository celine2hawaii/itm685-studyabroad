import React from 'react';
import { Link } from "react-router-dom";

export default function SACBreadcrumbs(props) {
  let { appid, grp, pg } = props;
  return (
    <React.Fragment>
      <div id="breadcrumbs" role="navigation" aria-labelledby="breadcrumbs" className="sac-breadcrumbs">
        <Link to={`/my_apps`}>My Apps</Link> 
        <span>{String.fromCharCode(62)}</span>
        { (grp === 'accept') 
            ? (pg === 'Acceptance Packets') ? pg 
                : <>
                  <Link to={`/accept/${appid}`}>Acceptance Packets</Link>
                  <span>{String.fromCharCode(62)}</span> 
                  {pg}
                </>
            : (pg === 'Application Checklist') ? pg 
                : <>
                  <Link to={`/checklist/${appid}`}>Application Checklist</Link>
                  <span>{String.fromCharCode(62)}</span> 
                  {pg}
                </>
        }
      </div>
    </React.Fragment>
  )
}
