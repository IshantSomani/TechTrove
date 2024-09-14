import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Link } from '@mui/material';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import ToolModal from './ToolModal';
import NetworkError from '../../ErrorBoundary/NetworkError';
import { deleteToolFromCategory, getAllAIToolsWithOutFilter } from '../../../redux/slices/aiTool';
import { Loading } from '../../../routes/Routes';

const Fetch_Interval = 4000;

export default function AiToolsDataTable({ open, setOpen, setOpenSnackBar, isDark }) {
  const dispatch = useDispatch();
  const { aiTools, status, error } = useSelector(state => state.aiTool);
  const [formData, setFormData] = useState({});
  const [edit, setEdit] = useState(false);

  const fetchData = useCallback(() => {
    dispatch(getAllAIToolsWithOutFilter());
  }, [dispatch]);

  useEffect(() => {
    fetchData();
    const fetchIntervalId = setInterval(fetchData, Fetch_Interval);
    return () => clearInterval(fetchIntervalId);
  }, [fetchData]);

  const handleClose = useCallback(() => {
    setOpen(false);
    setFormData({});
    setEdit(false);
  }, [setOpen]);

  const handleEditClick = useCallback((data) => {
    setEdit(true);
    setFormData(data);
    setOpen(true);
  }, [setOpen]);

  const handleDelete = useCallback(async (id) => {
    const [categoryId, toolId] = id.split('-');
    await dispatch(deleteToolFromCategory({ categoryId, toolId }));
    setOpenSnackBar(true);
    fetchData();
  }, [dispatch, setOpenSnackBar, fetchData]);


  if (status === 'loading' && !aiTools.length) {
    return <Loading />;
  }

  if (error) {
    return <NetworkError error={error} />;
  }


  const rows = aiTools.flatMap((category) =>
    category.tools.map((tool) => ({
      id: `${category._id}-${tool._id}`,
      category: category.category,
      ...tool
    }))
  ).map((row, index) => ({
    ...row,
    sno: index + 1
  }));

  const columns = [
    {
      field: 'sno',
      headerName: 'S.No.',
      width: 70,
      sortable: false,
    },
    {
      field: 'favicon',
      headerName: 'Icon',
      width: 70,
      sortable: false,
      renderCell: (params) => (
        <Box display="flex" justifyContent="center" alignItems="center" width="100%" height="100%">
          <img
            src={`https://www.google.com/s2/favicons?domain=${params.row.url}&sz=32`}
            alt={`${params.row.title} favicon`}
            style={{ width: '32px', height: '32px' }}
          />
        </Box>
      ),
    },
    { field: 'category', headerName: 'Category', width: 150 },
    {
      field: 'title',
      headerName: 'Tool Name',
      width: 150,
      renderCell: (params) => (
        <Link
          href={params.row.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`hover:underline`}
          underline="hover"
          color='primary'
        >
          {params.value}
        </Link>
      ),
    },
    { field: 'description', headerName: 'Description', width: 230, },
    { field: 'hitCount', headerName: 'Hit Count', width: 100, type: 'number' },
    { field: 'addedBy', headerName: 'Added By', width: 200 },
    {
      field: 'active',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${params.value
          ? 'bg-green-100 text-green-800'
          : 'bg-red-100 text-red-800'
          }`}>
          {params.value ? "Active" : "Inactive"}
        </span>
      )
    },
    {
      field: 'Action',
      headerName: 'Action',
      width: 120,
      renderCell: (params) => (
        <div className='flex gap-2'>
          <button
            onClick={() => handleEditClick(params.row)}
            className={`p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors duration-200`}
          >
            <PencilIcon className='h-5 w-5' />
          </button>
          <button
            onClick={() => handleDelete(params.row.id)}
            className={`p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200  transition-colors duration-200`}
          >
            <TrashIcon className='h-5 w-5' />
          </button>
        </div>
      )
    },
  ];

  return (
    <div className="h-fit w-full bg-white shadow-md rounded-lg overflow-hidden">
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 6 },
          },
        }}
        pageSizeOptions={[5, 10]}
        disableRowSelectionOnClick
        sx={{
          '& .MuiDataGrid-cell': {
            borderBottom: 'none',
            alignContent: 'center',
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#f3f4f6',
            color: '#374151',
            fontWeight: 'bold',
          },
          '& .MuiDataGrid-row': {
            '&:nth-of-type(odd)': {
              backgroundColor: '#f9fafb',
            },
            '&:hover': {
              backgroundColor: '#e5e7eb',
            },
          },
        }}
      />

      <ToolModal
        open={open}
        handleClose={handleClose}
        formData={formData}
        setFormData={setFormData}
        edit={edit}
        setOpenSnackBar={setOpenSnackBar}
        isDark={isDark}
      />
    </div>
  );
}