import React from 'react';

export default function SACStatusReferenceForm (props) {
  return (
    <React.Fragment>
      <div id="sac-status-info" className="alert alert-primary">
        <div className="row">
          <div className="col-4"><label>APPLICANT:</label></div><div className="col-8 sac-status-val">{props.applicant}</div>
        </div>
        <div className="row">
          <div className="col-4"><label>PROGRAM/LOCATION ABROAD:</label></div><div className="col-8 sac-status-val">{ props.programname }</div>
        </div>
        <div className="row">
          <div className="col-4"><label>STUDY ABROAD TERM:</label></div><div className="col-8 sac-status-val">{ props.termdesc }</div>
        </div>
        <div className="row">
          <div className="col-4"><label>DEADLINE:</label></div><div className="col-8 sac-status-val">{ props.appdeadline }</div>
        </div>
      </div>
    </React.Fragment>
  );
}
