import React, { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from "react-router-dom";

import "./sac-admin-home.css";
import jsonProgListing from './getProgramOfferingDetailByTerm-202440.json';
import jsonActiveTerms from './getActiveTerms.json';
import SACStatus from "./sac-templates/sac-status";
import { DataGrid } from '@mui/x-data-grid';


export default function Home(props) {

  const searchParam = props.searchParam;

  const progListing = transformProgListing(sortProgListing(jsonProgListing.data));
  const termListing = jsonActiveTerms.data;

  const [appListing, setAppListing] = useState([]);
  const [filterAdminAppStatus, setFilterAdminAppStatus] = useState("");
  const [filterApplicantName, setFilterApplicantName] = useState("");
  const [filterProgramName, setFilterProgramName] = useState("");
  const [filterProgramTrack, setFilterProgramTrack] = useState("");
  const [filterSearch, setFilterSearch] = useState("");
  const [filterTermCode, setFilterTermCode] = useState(202440);
  const [sortAppsBy, setSortAppsBy] = useState("");
  const [sortAscAppsByAppId, setSortAscAppsByAppId] = useState(true);
  const [sortAscAppsByFeePaymentCompleted, setSortAscAppsByFeePaymentCompleted] = useState("");
  const [sortAscAppsByLastMod, setSortAscAppsByLastMod] = useState("");
  const [sortAscAppsByName, setSortAscAppsByName] = useState("");
  const [sortAscAppsByCntRefSubmitted, setSortAscAppsByCntRefSubmitted] = useState("");

  const [checkedState, setCheckedState] = useState([]);


  useEffect(() => {
    getAppListing();
  }, []);



  function extractProgramNameWithoutTrack(programName) {
    return ((programName.indexOf("-") !== -1)
      ? programName.slice(0, programName.indexOf("-")).trim()
      : programName
    );
  }



  function extractProgramTrack(programName) {
    return ((programName.indexOf("-") !== -1)
      ? programName.slice((programName.indexOf("-") + 1)).trim()
      : "No Track"
    );
  }



  function filteredApps() {
    return appListing.filter(app => (
      app.programName.includes(
        ((filterProgramTrack === "")
          ? extractProgramNameWithoutTrack(filterProgramName)
          : filterProgramTrack
        )
      )
      && app.adminAppStatus.includes(filterAdminAppStatus)
      && (app.applicantName.toLowerCase().includes(
        filterApplicantName.toLowerCase())
      )
    ));
  }



  const getAppListing = useCallback(() => {
    setAppListing([]);

    (async () => {
      fetch('/data/getAllAppsPlusActiveLite-202440.json')
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          setAppListing(data.data);
          setCheckedState(new Array(data.data.length).fill(false))
        })
        .catch(error => console.error('There has been a problem with your fetch operation:', error));
    })();
  }, []);




  function handleChangeProgram(val) {
    setFilterProgramName(val);
    setFilterProgramTrack('');
  }



  const handleChangeTermCode = (termCode) => {
    setFilterApplicantName('');
    setFilterAdminAppStatus('');
    setFilterProgramName('');
    setFilterTermCode(termCode);
    if (termCode === '202440') {
      getAppListing();
    } else {
      setAppListing([]);
    }
    setSortAppsBy('');
  }



  function sortAppsByAppId(appListing) {
    let asc = (
      (sortAppsBy !== "appId") ? true
        : ((sortAscAppsByAppId === true) ? false : true)
    );
    setSortAscAppsByAppId(asc);
    setSortAppsBy('appId');

    return ((asc === true)
      ? appListing.sort(function (a, b) { return (((a.appId) > (b.appId)) ? 1 : -1) })
      : appListing.sort(function (a, b) { return (((a.appId) < (b.appId)) ? 1 : -1) })
    );
  }



  function sortAppsByCntRefSubmitted(appListing) {
    let asc = ((sortAppsBy !== "cntRefSubmitted") ? true
      : ((sortAscAppsByCntRefSubmitted === true) ? false : true)
    );
    setSortAscAppsByCntRefSubmitted(asc);
    setSortAppsBy('cntRefSubmitted');

    return ((asc === true)
      ? appListing.sort(function (a, b) { return (a.cntRefSubmitted ? 1 : -1) })
      : appListing.sort(function (a, b) { return (b.cntRefSubmitted ? 1 : -1) })
    );
  }



  function sortAppsByFeePaymentCompleted(appListing) {
    let asc = ((sortAppsBy !== "feePaymentCompleted") ? true
      : ((sortAscAppsByFeePaymentCompleted === true) ? false : true)
    );
    setSortAscAppsByFeePaymentCompleted(asc);
    setSortAppsBy('feePaymentCompleted');

    return ((asc === true)
      ? appListing.sort(function (a, b) { return (a.feePaymentCompleted ? 1 : -1) })
      : appListing.sort(function (a, b) { return (b.feePaymentCompleted ? 1 : -1) })
    );
  }



  function sortAppsByLastMod(appListing) {
    let asc = ((sortAppsBy !== "lastMod") ? false // lastMod default sort should be most recent mod first
      : ((sortAscAppsByLastMod === true) ? false : true)
    );
    setSortAscAppsByLastMod(asc);
    setSortAppsBy('lastMod');

    return ((asc === true)
      ? appListing.sort(function (a, b) { return (((a.lastModified) > (b.lastModified)) ? 1 : -1) })
      : appListing.sort(function (a, b) { return (((a.lastModified) < (b.lastModified)) ? 1 : -1) })
    );
  }



  function sortAppsByName(appListing) {
    let asc = ((sortAppsBy !== "name") ? true
      : ((sortAscAppsByName === true) ? false : true)
    );
    setSortAscAppsByName(asc);
    setSortAppsBy('name');
    return ((asc === true)
      ? appListing.sort(function (a, b) {
        return ((
          a.applicantName.toLowerCase() >
          b.applicantName.toLowerCase()
        ) ? 1 : -1)
      })
      : appListing.sort(function (a, b) {
        return ((
          a.applicantName.toLowerCase() <
          b.applicantName.toLowerCase()
        ) ? 1 : -1)
      })
    );
  }



  function sortProgListing(progListing) {
    return progListing.sort(function (a, b) {
      return (
        (a.programName > b.programName) ? 1
          : ((a.programName < b.programName) ? -1
            : ((parseInt(a.termCode) < parseInt(b.termCode)) ? 1 : -1)
          )
      )
    });
  }



  function transformProgListing(progListing) {
    var progSet = new Set();
    progListing.map(p => {
      p.programNameWithoutTrack = extractProgramNameWithoutTrack(p.programName);
      p.programTrack = extractProgramTrack(p.programName);

      p.includeProgListing = !progSet.has(p.termCode + extractProgramNameWithoutTrack(p.programName));
      progSet.add(extractProgramNameWithoutTrack(p.termCode + p.programName));
      return p;
    });
    return progListing;
  }

  // Added Code

  const [selectedOption, setSelectedOption] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
const [selectedApps, setSelectedApps] = useState([])

const columns = [
  { field: 'Applicantprgram', headerName: 'Applicant Program',
	valueGetter: (value, row) => `${row.programName || ''}`
},
  { field: 'applicantProgram', headerName: 'Name',
	valueGetter: (value, row) => `${row.applicantName || ''}`
},
  { field: 'email', headerName: 'Email',
	valueGetter: (value, row) => `${row.email || ''}`
},
  { field: 'lastModified', headerName: 'Last Updated'},
  { field: 'info', headerName: 'Info'},
  { field: 'academicReferenceCompleted', headerName: 'Acad'},
  { field: 'repeatAppDesc', headerName: 'Rpt?'},
  { field: 'cntRefRequested', headerName: 'Ref Rcvd'},
  { field: 'posCompleted', headerName: 'PoSS'},
  { field: 'suppInfoCompleted', headerName: 'Supp'},
  { field: 'surveyCompleted', headerName: 'Survey'},
  { field: 'feePaymentCompleted', headerName: 'Fee'},
  { field: 'adminAppStatus', headerName: 'Status'},
  { field: 'depositPaymentCompleted', headerName: 'Init Pmt'},
];

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
    console.log(event.target.value);
  };

  const onFileChange = (event) => {
    setUploadedFile(event.target.files[0]);
    console.log(event.target.files[0].name);
  };


  const sendFileRequest = () => {
    console.log("Sent file");
    // Send file request to API
  }

  const sendStatusUpdate = () => {
    console.log("Updated status");
	let updatedApps = appListing;
	selectedApps.forEach((appId) => {
		let idx = appListing.findIndex(x => x.appId === appId);
		updatedApps[idx].adminAppStatus = selectedOption;
		console.log(appId, idx)
})
	setAppListing(updatedApps)
  }

  const Checkbox = ({ isChecked, checkHandler, index }) => {
    return (
      <div>
        <input
          type="checkbox"
          id={`checkbox-${index}`}
          checked={isChecked}
          onChange={checkHandler}
        />
      </div>
    )
  }

  const appListingState = filteredApps().map(element => (
      {app: element, checked: false}
  ));

  const updateCheckStatus = (ids) => {
  	const selectedIDs = new Set(ids);
	setSelectedApps(ids)
  }



  return (
    <>
      <>
      {/* Added Code */}
        {/* <label for="myfile">Choose File</label> */}
        <input type="file" id="myfile" name="myfile" onChange={onFileChange} />
        <br/>
        <button onClick={sendFileRequest}>Upload Transcript</button>
	<br/>
	<br/>
	<br/>
        <div>
          <label htmlFor="selectOption">Select an option:</label>  {`   `}
          <select id="selectOption" value={selectedOption} onChange={handleSelectChange}>
              <option value="">Any Status</option>
              <option value="Incomplete">Incomplete</option>
              <option value="Submitted">Submitted</option>
              <option value="Under Review">Under Review</option>
              <option value="Complete - Approved">Complete - Approved</option>
              <option value="Complete - Denied">Complete - Denied</option>
              <option value="Complete - Exception">Complete - Exception</option>
              <option value="Complete - Withdrew">Complete - Withdrew</option>
          </select>
          <button onClick={sendStatusUpdate}>Update Status</button>
        </div>

	    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
	getRowId={(row) => row.appId}
        rows={filteredApps()}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
	onRowSelectionModelChange={(ids) => updateCheckStatus(ids)}
      />
    </div>
      </>


      <SACStatus />

      <div id="main" role="main" aria-labelledby="main">

        <ul className="nav nav-tabs">
          <li className="nav-item nav-link active alert-primary" >Apps</li>
          <li className="nav-item nav-link" >
            <Link to={``}>Accept</Link>
          </li>
          <li className="nav-item nav-link" >
            <Link to={``}>Stats</Link>
          </li>
        </ul>

        <h1>Applications</h1>

        <div className="row mt-2">

          <div className="col-lg-3 mt-lg-0 mt-2">
            <label htmlFor="filterTermCode" className="sr-only">Term</label>
            <select id="filterTermCode" name="filterTermCode" className="form-control" value={filterTermCode || ""} onChange={e => handleChangeTermCode(e.target.value)}>
              {termListing.map(term =>
                <option key={term.termCode} className="form-control" value={term.termCode}>{term.termDesc}</option>
              )}
            </select>
          </div>

          <div className="col-lg-3 mt-lg-0 mt-2">
            <label htmlFor="filterProgramName" className="sr-only">Program</label>
            <select id="filterProgramName" name="filterProgramName" className="form-control" value={filterProgramName || ""} onChange={e => handleChangeProgram(e.target.value)}>
              <option value="">ALL Programs</option>
              {progListing.filter(p => (p.includeProgListing)).map((p) =>
                <option
                  key={p.programOfferingId}
                  value={p.programName}>
                  {p.programNameWithoutTrack}
                </option>
              )}
            </select>
          </div>
          {(filterProgramName === "")
            || (progListing.filter(p => (
              p.programName.startsWith(extractProgramNameWithoutTrack(filterProgramName))
            )).length <= 1)
            ? null : <>
              <div className="col-lg-6 mt-lg-0 mt-2">
                <label htmlFor="filterProgramTrack" className="sr-only">Track</label>
                <select id="filterProgramTrack" name="filterProgramTrack" className="form-control" value={filterProgramTrack || ""} onChange={e => setFilterProgramTrack(e.target.value)}>
                  <option value="">ALL Tracks</option>
                  {progListing.filter(p => (
                    p.programName.startsWith(extractProgramNameWithoutTrack(filterProgramName))
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
            <select id="filterAdminAppStatus" name="filterAdminAppStatus" className="form-control" value={filterAdminAppStatus || ""} onChange={e => setFilterAdminAppStatus(e.target.value)}>
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
          <input id="filterApplicantName" name="filterApplicantName" className="form-control mt-2" type="text" value={filterApplicantName} onChange={e => setFilterApplicantName(e.target.value)} placeholder="Applicant Name to search for..." />
        </div>

      </div>



      {(appListing.length === 0) ? null :
        <div className="alert alert-success mt-2">
          {filteredApps().length + ' app' + ((filteredApps().length === 1) ? '' : 's')}
        </div>
      }


      {(appListing.length === 0) ? null :
        <table className="table table-striped sac-apps">
          <caption className="sr-only">List of applications</caption>
          <thead>
            <tr>
              <th className="text-center" scope="col">Select</th>
              <th className="text-center" scope="col">
                <span className="btn link-blue p-0" onClick={() => { setAppListing(sortAppsByAppId(appListing)) }}>
                  App<br />ID
                  {sortAppsBy === "appId"
                    ? <> <span aria-hidden="true" className={(sortAscAppsByAppId === true) ? "fas fa-caret-up" : "fas fa-caret-down"}><span className="sr-only">Sort by app ID</span></span>
                    </> : null}
                </span>
              </th>
              <th className="text-left" scope="col">
                <span className="btn link-blue p-0" onClick={() => { setAppListing(sortAppsByName(appListing)) }}>
                  Applicant
                  {sortAppsBy === "name"
                    ? <> <span aria-hidden="true" className={(sortAscAppsByName === true) ? "fas fa-caret-up" : "fas fa-caret-down"}><span className="sr-only">Sort by applicant name</span></span>
                    </> : null}
                </span>
                <br />Program</th>
              <th className="text-center" scope="col">
                <span className="btn link-blue p-0" onClick={() => { setAppListing(sortAppsByLastMod(appListing)) }}>
                  Last
                  {sortAppsBy === "lastMod"
                    ? <> <span aria-hidden="true" className={(sortAscAppsByLastMod === true) ? "fas fa-caret-up" : "fas fa-caret-down"}><span className="sr-only">Sort by when app was last updated</span></span>
                    </> : null}
                  <br />Updated
                </span>
              </th>
              <th className="text-center" scope="col">Info</th>
              <th className="text-center" scope="col">Acad</th>
              <th className="text-center" scope="col">Rpt?</th>
              <th className="text-center" scope="col">
                <span className="btn link-blue p-0" onClick={() => { setAppListing(sortAppsByCntRefSubmitted(appListing)) }}>
                  Ref<br />Rcvd
                  {sortAppsBy === "cntRefSubmitted"
                    ? <> <span aria-hidden="true" className={(sortAscAppsByCntRefSubmitted === true) ? "fas fa-caret-up" : "fas fa-caret-down"}><span className="sr-only">Sort by the number of references received</span></span>
                    </> : null}
                </span>
              </th>
              <th className="text-center" scope="col">PoSS</th>
              <th className="text-center" scope="col">Supp</th>
              <th className="text-center" scope="col">Srvy</th>
              <th className="text-center" scope="col">
                <span className="btn link-blue p-0" onClick={() => { setAppListing(sortAppsByFeePaymentCompleted(appListing)) }}>
                  Fee
                  {sortAppsBy === "feePaymentCompleted"
                    ? <> <span aria-hidden="true" className={(sortAscAppsByFeePaymentCompleted === true) ? "fas fa-caret-up" : "fas fa-caret-down"}><span className="sr-only">Sort by app fee paid</span></span>
                    </> : null}
                </span>
              </th>
              <th className="text-center" scope="col">Status</th>
              <th className="text-center" scope="col">Init<br />Pmt</th>
              <th className="text-center" scope="col">Revrs<br />Rpt</th>
            </tr>
          </thead>
          <tbody>
            {filteredApps().map((app, index) =>
              <tr key={app.appId}>
                <td className="text-center bdr-lt-rt">
                  {/* <input type="checkbox" id={app.appId} name={app.applicantName} /> */}
                  <Checkbox
                    key={app.appId}
                    isChecked={checkedState[index]}
                    checkHandler={() => updateCheckStatus(index)}
                    index={index}
                  />
                </td>
                <td className="text-center px-4 bdr-rt">{app.appId}</td>
                <td className="text-left">
                  <span className="font-weight-bold">
                    <Link>{app.applicantName}</Link><br />
                  </span>
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
                  <button
                    className="btn btn-primary sac-admin-print"
                    aria-label={"Reviewers Report for " + app.lastName + ", " + app.firstName + " " + app.middleInitial}
                    title="print reviewers report">
                    <span aria-hidden="true" className="fas fa-print"></span><span className="sr-only">Reviewers Report for {app.lastName}, {app.firstName} {app.middleInitial} - {app.programName}</span>
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      }


    </>);
}
