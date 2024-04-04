import React from 'react';
import { 
  Link,
  Navigate, 
  Outlet,
  Route, 
  Routes
} from "react-router-dom";

import "./sac-admin-home.css";

import SACStatus from "../sac-templates/sac-status";

class SACAdminHome extends React.Component {

  constructor(props) {
    super(props);

    this.auth = props.auth;
    this.pgTitle = "Applications";
    const { termcode } = props.match.params;
    this.propsTermCode = (typeof(termcode) === 'undefined') ? '202440' : termcode;

    this.state = {
      appListing: [],
      filterApplicantName: '',
      filterAdminAppStatus: '',
      filterProgramName: '',
      filterProgramTrack: '',
      filterTermCode: '',
      progListing: [],
      sortAppsBy: '',
      sortAppsByAppId: '',
      sortAppsByFeePaymentCompleted: '',
      sortAppsByLastMod: '',
      sortAppsByName: '',
      sortAppsByCntRefSubmitted: '',
      termListing: [],
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleChangeProgram = this.handleChangeProgram.bind(this);
    this.extractProgramNameWithoutTrack = this.extractProgramNameWithoutTrack.bind(this);
  }

  componentDidMount() {
    if (this.auth.status !== "Authenticated") {
      this.props.history.push(`/sac-admin-login`)
    } else {
      axios.get(SACAdminApi({call:'isAdmin', params:{userName:this.auth.userName}}), {})
        .then(res => {
          const isAdmin = (res.data.data.pop().isAdmin);
          if(isAdmin) {
            axios.get(SACAdminApi({call:'getTermListing', params:{}}))
              .then(res => {
                this.setState({ termListing: res.data.data });
                this.handleChangeTermCode((this.propsTermCode === '') ? this.state.termListing[0].termCode : this.propsTermCode);
              })
              .catch((error) => {
                if (error.response.data.message === 'Unauthenticated') {
                  this.props.history.push(`/sac-admin-login`);
                } else {
                  // TODO: Show error message?
                  this.setState({ termListing: [] })
                }
              })
          } else {
            this.props.history.push(`/sac-admin-login-error`)
          }
        })
        .catch((error) => {
          this.props.history.push(`/sac-admin-login-error`)
        })
    }

  }

  extractProgramNameWithoutTrack(programName) {
    return ( (programName.indexOf("-") !== -1)
      ? programName.slice(0, programName.indexOf("-")).trim()
      : programName
    );
  }

  extractProgramTrack(programName) {
    return ( (programName.indexOf("-") !== -1)
      ? programName.slice((programName.indexOf("-") + 1)).trim()
      : "No Track"
    );
  }


  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState(prevState => ({ [name]: value }));
  }

  handleChangeProgram(event) {
    this.setState({ filterProgramName: event.target.value });
    this.setState({ filterProgramTrack: '' });
  }

  handleChangeTermCode = (termCode) => {
    this.setState({ filterApplicantName: ''});
    this.setState({ filterAdminAppStatus: ''});
    this.setState({ filterProgramName: ''});
    this.setState({ filterTermCode: termCode });
    this.setState({ sortAppsBy: ''});
    this.loadApps(termCode);
    this.loadProgs(termCode);
  }

  loadApps = (termCode) => {
    axios.get(SACAdminApi({call:'getAppListingByTerm', params:{termCode:termCode}}))
      .then(res => {
        this.setState({ appListing: this.sortAppsByName(res.data.data) });
      })
      .catch((error) => {
        if (error.response.data.message === 'Unauthenticated') {
          this.props.history.push(`/sac-admin-login`);
        } else {
          // TODO: Show error message?
          this.setState({ appListing: [] });
        }
      })
  }

  loadProgs = (termCode) => {
    axios.get(SACAdminApi({call:'getProgListing', params:{termcode:termCode}}))
      .then(res => {
        //this.setState({ progListing: res.data.data })
        //this.setState({ progListing: this.sortProgListing(res.data.data) });
        this.setState({ progListing: this.transformProgListing(this.sortProgListing(res.data.data)) });
      })
      .catch((error) => {
        if (error.response.data.message === 'Unauthenticated') {
          this.props.history.push(`/sac-admin-login`);
        } else {
          // TODO: Show error message?
          this.setState({ progListing: [] })
        }
      })
  }



  sortAppsByAppId(appListing) {
    let sortOrder = ( (this.state.sortAppsBy !== "appId")
      ? "asc"
      : ( (this.state.sortAppsByAppId === "asc") ? "desc" : "asc" )
    );
    this.setState({ sortAppsByAppId: sortOrder });
    this.setState({ sortAppsBy: 'appId' });

    return ( (sortOrder === "asc")
      ? appListing.sort(function(a, b) { return (((a.appId) > (b.appId)) ? 1 : -1) })
      : appListing.sort(function(a, b) { return (((a.appId) < (b.appId)) ? 1 : -1) })
    );
  }



  sortAppsByCntRefSubmitted(appListing) {
    let sortOrder = ( (this.state.sortAppsBy !== "cntRefSubmitted")
      ? "asc"
      : ( (this.state.sortAppsByCntRefSubmitted === "asc") ? "desc" : "asc" )
    );
    this.setState({ sortAppsByCntRefSubmitted: sortOrder });
    this.setState({ sortAppsBy: 'cntRefSubmitted' });

    return ( (sortOrder === "asc")
      ? appListing.sort(function(a, b) { return (a.cntRefSubmitted ? 1 : -1) })
      : appListing.sort(function(a, b) { return (b.cntRefSubmitted ? 1 : -1) })
    );
  }



  sortAppsByFeePaymentCompleted(appListing) {
    let sortOrder = ( (this.state.sortAppsBy !== "feePaymentCompleted")
      ? "asc"
      : ( (this.state.sortAppsByFeePaymentCompleted === "asc") ? "desc" : "asc" )
    );
    this.setState({ sortAppsByFeePaymentCompleted: sortOrder });
    this.setState({ sortAppsBy: 'feePaymentCompleted' });

    return ( (sortOrder === "asc")
      ? appListing.sort(function(a, b) { return (a.feePaymentCompleted ? 1 : -1) })
      : appListing.sort(function(a, b) { return (b.feePaymentCompleted ? 1 : -1) })
    );
  }



  sortAppsByLastMod(appListing) {
    let sortOrder = ( (this.state.sortAppsBy !== "lastMod")
      ? "desc" // lastMod default sort should be most recent mod first
      : ( (this.state.sortAppsByLastMod === "asc") ? "desc" : "asc" )
    );
    this.setState({ sortAppsByLastMod: sortOrder });
    this.setState({ sortAppsBy: 'lastMod' });

    return ( (sortOrder === "asc")
      ? appListing.sort(function(a, b) { return (((a.lastModified) > (b.lastModified)) ? 1 : -1) })
      : appListing.sort(function(a, b) { return (((a.lastModified) < (b.lastModified)) ? 1 : -1) })
    );
  }



  sortAppsByName(appListing) {
    let sortOrder = ( (this.state.sortAppsBy !== "name")
      ? "asc"
      : ( (this.state.sortAppsByName === "asc") ? "desc" : "asc" )
    );
    this.setState({ sortAppsByName: sortOrder });
    this.setState({ sortAppsBy: 'name' });
    return ( (sortOrder === "asc")
      ? appListing.sort(function(a, b) {
          return ((
            a.applicantName.toLowerCase() > 
            b.applicantName.toLowerCase()
          ) ? 1 : -1)})
      : appListing.sort(function(a, b) {
          return ((
            a.applicantName.toLowerCase() <
            b.applicantName.toLowerCase()
          ) ? 1 : -1)})
    );
  }

  sortProgListing(progListing) {
    return progListing.sort(function(a, b) {
      return (
        (a.programName > b.programName) ? 1 
          : ( (a.programName < b.programName) ? -1
            : ( (parseInt(a.termCode) < parseInt(b.termCode)) ? 1 : -1 )
            )
      ) 
    });
  }

  transformProgListing(progListing) {
    var progSet = new Set();
    progListing.map(p => {
      p.programNameWithoutTrack = this.extractProgramNameWithoutTrack(p.programName);
      p.programTrack = this.extractProgramTrack(p.programName);

      p.includeProgListing = !progSet.has(p.termCode + this.extractProgramNameWithoutTrack(p.programName));
      progSet.add(this.extractProgramNameWithoutTrack(p.termCode + p.programName));
      return p;
    });
    return progListing;
  }

  filteredApps() 
  { 
    return this.state.appListing.filter( app => ( 
                  app.programName.includes(
                    ( (this.state.filterProgramTrack === "")
                      ? this.extractProgramNameWithoutTrack(this.state.filterProgramName)
                      : this.state.filterProgramTrack
                    )
                  )
                  && app.adminAppStatus.includes(this.state.filterAdminAppStatus)
                  && ( app.applicantName.toLowerCase().includes(
                    this.state.filterApplicantName.toLowerCase())
                  )
                ) );
  }

  render() {
    return (
      <React.Fragment>
        <SACStatus applicant={this.auth.firstName + ' ' + this.auth.lastName} />
        <div id="main" role="main" aria-labelledby="main">

          <ul className="nav nav-tabs">
            <li className="nav-item nav-link active alert-primary" >Apps</li>
            <li className="nav-item nav-link" >
              <Link to={`/sac-admin-accept`}>Accept</Link>
            </li>
            <li className="nav-item nav-link" >
              <Link to={`/sac-admin-stats`}>Stats</Link>
            </li>
          </ul>

          <h1 ref={this.props.pgTitleRef}>{this.pgTitle}</h1>

          <div className="row mt-2">
            <div className="col-lg-3 mt-lg-0 mt-2">
              <label htmlFor="filterTermCode" className="sr-only">Term</label>

              <select id="filterTermCode" name="filterTermCode" className="form-control" value={this.state.filterTermCode || ""} onChange={e => this.handleChangeTermCode(e.target.value)}>
                { this.state.termListing.map(term => 
                <option key={term.termCode} className="form-control" value={term.termCode}>{term.termDesc}</option>
                )}
              </select>
            </div>
            <div className="col-lg-3 mt-lg-0 mt-2">
              <label htmlFor="filterProgramName" className="sr-only">Program</label>
              <select id="filterProgramName" name="filterProgramName" className="form-control" value={this.state.filterProgramName || ""} onChange={this.handleChangeProgram}>
                <option value="">ALL Programs</option>
                { this.state.progListing.filter(p => (p.includeProgListing)).map((p) => 
                  <option 
                    key={p.programOfferingId} 
                    value={p.programName}>
                    {p.programNameWithoutTrack}
                  </option>
                )}
              </select>
            </div>
          { (this.state.filterProgramName === "") 
            || (this.state.progListing.filter(p => (
                 p.programName.startsWith(this.extractProgramNameWithoutTrack(this.state.filterProgramName)) 
                   )).length <= 1)
            ? null : <>
            <div className="col-lg-6 mt-lg-0 mt-2">
              <label htmlFor="filterProgramTrack" className="sr-only">Track</label>
              <select id="filterProgramTrack" name="filterProgramTrack" className="form-control" value={this.state.filterProgramTrack || ""} onChange={this.handleChange}>
                <option value="">ALL Tracks</option>
                { this.state.progListing.filter(p => (
                    p.programName.startsWith(this.extractProgramNameWithoutTrack(this.state.filterProgramName)) 
                  )).map((p, index) => 
                  <option 
                    key={p.programOfferingId} 
                    value={p.programName}>
                    {p.programTrack}
                  </option>
                )}
              </select>
            </div>
          </>}
          </div>
          <div className="row mt-2">
            <div className="col-lg-3 mt-lg-0 mt-2">
              <label htmlFor="filterAdminAppStatus" className="sr-only">Application Status</label>
              <select id="filterAdminAppStatus" name="filterAdminAppStatus" className="form-control" value={this.state.filterAdminAppStatus || ""} onChange={this.handleChange}>
                <option value="">Any Status</option>
                <option value="Incomplete">Incomplete</option>
                <option value="Submitted">Submitted</option>
                <option value="Under Review">Under Review</option>
                <option value="Complete - Approved">Complete - Approved</option>
                <option value="Complete - Denied">Complete - Denied</option>
                <option value="Complete - Exception">Complete - Exception</option>
                <option value="Complete - Withdrew">Complete - Withdrew</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="filterApplicantName" className="sr-only">Applicant Name</label>
            <input id="filterApplicantName" name="filterApplicantName" className="form-control mt-2" type="text" value={this.state.filterApplicantName} onChange={this.handleChange} placeholder="Applicant Name to search for..." />
          </div>



          <div class="alert alert-success mt-2">
            { this.filteredApps().length + ' app' + ( (this.filteredApps().length === 1) ? '' : 's') }
          </div>



          { (this.state.appListing.length === 0) ? null : 
            <table className="table table-striped sac-apps">
              <caption className="sr-only">List of applications</caption>
              <thead>
                <tr>
                  <th className="text-center" scope="col">
                    <span className="btn link-blue p-0" onClick={ () => { this.setState({ appListing: this.sortAppsByAppId(this.state.appListing) })}}>
                      App<br />ID
                    {this.state.sortAppsBy === "appId" 
                      ? <> <span aria-hidden="true" className={(this.state.sortAppsByAppId === "asc") ? "fas fa-caret-up" : "fas fa-caret-down"}><span className="sr-only">Sort by app ID</span></span>
                      </> : null}
                    </span>
                  </th>
                  <th className="text-left" scope="col">
                    <span className="btn link-blue p-0" onClick={ () => { this.setState({ appListing: this.sortAppsByName(this.state.appListing) })}}>
                      Applicant
                    {this.state.sortAppsBy === "name" 
                      ? <> <span aria-hidden="true" className={(this.state.sortAppsByName === "asc") ? "fas fa-caret-up" : "fas fa-caret-down"}><span className="sr-only">Sort by applicant name</span></span>
                      </> : null}
                    </span>
                    <br />Program</th>
                  <th className="text-center" scope="col">
                    <span className="btn link-blue p-0" onClick={ () => { this.setState({ appListing: this.sortAppsByLastMod(this.state.appListing) })}}>
                      Last
                    {this.state.sortAppsBy === "lastMod" 
                      ? <> <span aria-hidden="true" className={(this.state.sortAppsByLastMod === "asc") ? "fas fa-caret-up" : "fas fa-caret-down"}><span className="sr-only">Sort by when app was last updated</span></span>
                      </> : null}
                      <br />Updated
                    </span>
                  </th>
                  <th className="text-center" scope="col">Info</th>
                  <th className="text-center" scope="col">Acad</th>
                  <th className="text-center" scope="col">Rpt?</th>
                  <th className="text-center" scope="col">
                    <span className="btn link-blue p-0" onClick={ () => { this.setState({ appListing: this.sortAppsByCntRefSubmitted(this.state.appListing) })}}>
                      Ref
                      <br />Rcvd
                    {this.state.sortAppsBy === "cntRefSubmitted" 
                      ? <> <span aria-hidden="true" className={(this.state.sortAppsByCntRefSubmitted === "asc") ? "fas fa-caret-up" : "fas fa-caret-down"}><span className="sr-only">Sort by the number of references received</span></span>
                      </> : null}
                    </span>
                  </th>
                  <th className="text-center" scope="col">PoSS</th>
                  <th className="text-center" scope="col">Supp</th>
                  <th className="text-center" scope="col">Srvy</th>
                  <th className="text-center" scope="col">
                    <span className="btn link-blue p-0" onClick={ () => { this.setState({ appListing: this.sortAppsByFeePaymentCompleted(this.state.appListing) })}}>
                    Fee
                    {this.state.sortAppsBy === "feePaymentCompleted" 
                      ? <> <span aria-hidden="true" className={(this.state.sortAppsByFeePaymentCompleted === "asc") ? "fas fa-caret-up" : "fas fa-caret-down"}><span className="sr-only">Sort by app fee paid</span></span>
                      </> : null}
                    </span>
                  </th>
                  <th className="text-center" scope="col">Status</th>
                  <th className="text-center" scope="col">Init<br />Pmt</th>
                  <th className="text-center" scope="col">Revrs<br />Rpt</th>
                </tr>
              </thead>
              <tbody>
                { this.filteredApps().map(app => 
                    <tr key={app.appId}>
                      <td className="text-center px-4 bdr-rt">{app.appId}</td>
                      <td className="text-left">
                        <span className="font-weight-bold"><Link to={{
                            pathname: `/sac-admin-report-for-sac/${app.appId}`,
                            state: {
                              retTermCode: this.state.filterTermCode,
                            }
                          }}>
                            {app.applicantName}<br />
                        </Link></span>
                        {app.email}<br />
                        {app.programName}
                      </td>
                      <td className="text-center bdr-lt-rt">{app.lastModified}</td>
                      <td className="text-center bdr-rt">
                        {app.applicantCompleted
                          ? <><span aria-hidden="true" className="fas fa-check"></span><span className="sr-only">applicant info completed for {app.applicantName} - {app.programName}</span></>
                          : null
                        }
                      </td>
                      <td className="text-center bdr-rt">
                        {app.academicBackgroundCompleted
                          ? <><span aria-hidden="true" className="fas fa-check"></span><span className="sr-only">academic background completed for {app.applicantName} - {app.programName}</span></>
                          : null
                        }
                      </td>
                      <td className="text-center bdr-rt">{app.repeatAppDesc}</td>
                      <td className="text-center bdr-rt">{app.cntRefSubmitted}</td>
                      <td className="text-center bdr-rt">
                        {app.posCompleted
                          ? <><span aria-hidden="true" className="fas fa-check"></span><span className="sr-only">program of study statement completed for {app.applicantName} - {app.programName}</span></>
                          : null
                        }
                      </td>
                      <td className="text-center bdr-rt">
                        {app.suppInfoCompleted
                          ? <><span aria-hidden="true" className="fas fa-check"></span><span className="sr-only">supplemental info completed for {app.lastName}, {app.firstName} {app.middleInitial} - {app.programName}</span></>
                          : null
                        }
                      </td>
                      <td className="text-center bdr-rt">
                        {app.surveyCompleted
                          ? <><span aria-hidden="true" className="fas fa-check"></span><span className="sr-only">survey completed for {app.lastName}, {app.firstName} {app.middleInitial} - {app.programName}</span></>
                          : null
                        }
                      </td>
                      <td className="text-center bdr-rt">
                        {app.feePaymentCompleted
                          ? <><span aria-hidden="true" className="fas fa-check"></span><span className="sr-only">app fee paid for {app.lastName}, {app.firstName} {app.middleInitial} - {app.programName}</span></>
                          : null
                        }
                      </td>
                      <td className="text-center bdr-rt">{app.adminAppStatus}</td>
                      <td className="text-center bdr-rt">
                        {app.depositPaymentCompleted
                          ? <><span aria-hidden="true" className="fas fa-check"></span><span className="sr-only">initial payment received for {app.lastName}, {app.firstName} {app.middleInitial} - {app.programName}</span></>
                          : null
                        }
                      </td>
                      <td className="text-center">
                        <Link to={{
                            pathname: `/sac-admin-report-for-reviewers/${app.appId}`,
                            state: {
                              retTermCode: this.state.filterTermCode,
                            }
                          }}>
                          <button 
                            className="btn btn-primary sac-admin-print" 
                            aria-label={"Reviewers Report for "+ app.lastName +", "+ app.firstName +" "+ app.middleInitial}
                            title="print reviewers report">
                            <span aria-hidden="true" className="fas fa-print"></span><span className="sr-only">Reviewers Report for {app.lastName}, {app.firstName} {app.middleInitial} - {app.programName}</span>
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ) }
              </tbody>
            </table>
            }
        </div>
      </React.Fragment>
    );
  }


}
export default (SACAdminHome)
