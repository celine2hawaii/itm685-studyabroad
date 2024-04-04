import React from 'react';

export default function SACStatusExt() {
  return (
    <React.Fragment>
      <div id="sac-status-info" className="alert alert-primary">
        <div className="row">
          <div className="col-4"><label>APPLICANT:</label></div><div className="col-8 sac-status-val">Chase Kawakami</div>
        </div>
        <div className="row">
          <div className="col-4"><label>PROGRAM/LOCATION ABROAD:</label></div><div className="col-8 sac-status-val">Machida, Japan</div>
        </div>
        <div className="row">
          <div className="col-4"><label>STUDY ABROAD TERM:</label></div><div className="col-8 sac-status-val">Year 2020-2021</div>
        </div>
      </div>
    </React.Fragment>
  );
}
