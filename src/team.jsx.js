import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

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

export default function DataTable(props) {
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
	getRowId={(row) => row.appId}
        rows={props.rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
      />
    </div>
  );
}