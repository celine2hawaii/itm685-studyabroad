import React from 'react';
import { withRouter } from "react-router";
import SACApi from "../sac-utils/sac-api";

class SACStatusAccept extends React.Component {

  constructor(props) {
    super(props);

    this.logoutUrl = SACApi({call:'logout', params:''});
  }

  componentDidMount() {
  }

  render() {
    return (
      <React.Fragment>
        <div id="sac-status-info" className="alert alert-primary">
          <div className="row">
            <div role="navigation" aria-labelledby="logout-btn" className="col-12 sac-status-val">
              {this.props.applicant}
              <a id="logout-btn" href={ this.logoutUrl }>
                <button className="btn btn-primary sac-logout" title="logout" >
                  <span className="fas fa-sign-out-alt sac-logout" aria-hidden="true"></span> Logout
                </button>
              </a>
            </div>
          </div>
        </div>

        {this.props.appid && this.props.appstatus &&
          <>
            <div id="sac-status-status" role="main" aria-labelledby="sac-status-status" className="alert alert-warning">
              <div className="row">
                <div className="col-4"><label>PROGRAM/LOCATION ABROAD:</label></div><div className="col-8 sac-status-val">{this.props.programname}</div>
              </div>
              <div className="row">
                <div className="col-4"><label>STUDY ABROAD TERM:</label></div><div className="col-8 sac-status-val">{this.props.termdesc}</div>
              </div>
            </div>
          </>
          }
      </React.Fragment>
    );
  }
}
export default withRouter(SACStatusAccept)
