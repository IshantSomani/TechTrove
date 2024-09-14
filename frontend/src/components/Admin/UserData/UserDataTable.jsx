import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DataGrid } from '@mui/x-data-grid';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import NetworkError from '../../ErrorBoundary/NetworkError';
import { getAllUsers, deleteUser } from '../../../redux/slices/user';
import { Loading } from '../../../routes/Routes';
import UserToolModal from './UserToolModal';
import { getAIToolById } from '../../../redux/slices/aiTool';

const FETCH_INTERVAL = 10000;
const MAX_RETRIES = 3;

const UserDataTable = ({ open, setOpen, setOpenSnackBar, isDark }) => {
    const dispatch = useDispatch();
    const { users, status, error } = useSelector(state => state.user);
    const { aiTools } = useSelector(state => state.aiTool);
    const [formData, setFormData] = useState({});
    const [edit, setEdit] = useState(false);

    const fetchData = useCallback(() => {
        dispatch(getAllUsers());
    }, [dispatch]);
    console.log("formData: ",formData)

    useEffect(() => {
        fetchData();
        const fetchIntervalId = setInterval(fetchData, FETCH_INTERVAL);
        return () => clearInterval(fetchIntervalId);
    }, [fetchData]);

    const fetchAITool = useCallback(async (categoryId, toolId, retries = 0) => {
        try {
            const result = await dispatch(getAIToolById({ categoryId, toolId })).unwrap();
            if (!result || !result.tool) {
                throw new Error('Empty result');
            }
        } catch (error) {
            console.error(`Error fetching AI Tool for category ${categoryId}, tool ${toolId}:`, error);
            if (retries < MAX_RETRIES) {
                // console.log(`Retrying fetch for category ${categoryId}, tool ${toolId}. Attempt ${retries + 1}`);
                await new Promise(resolve => setTimeout(resolve, 3000)); // Wait for 3 seconds before retrying
                await fetchAITool(categoryId, toolId, retries + 1);
            }
        }
    }, [dispatch]);

    useEffect(() => {
        if (users) {
            users.forEach(user => {
                user.aiTools.forEach(aiTool => {
                    aiTool.tools.forEach(toolId => {
                        fetchAITool(aiTool.category, toolId);
                    });
                });
            });
        }
    }, [users, fetchAITool]);

    const handleClose = useCallback(() => {
        setOpen(false);
        setFormData({});
        setEdit(false);
    }, [setOpen]);

    const handleEditClick = useCallback((data) => {
        setEdit(true);
        setFormData({
            userId: data.userId,
            email: data.email,
            category: data.category,
            title: data.toolName,
            description: data.toolDescription,
            url: data.toolUrl,
            hitCount: data.hitCount,
            addedBy: data.addedBy,
            active: data.active || false, // Assuming you have this field
        });
        setOpen(true);
    }, [setOpen]);

    const handleDelete = useCallback(async (userId, toolId) => {
        try {
            await dispatch(deleteUser(userId)).unwrap();
            setOpenSnackBar(true);
            fetchData();
        } catch (error) {
            console.error('Failed to delete user:', error);
        }
    }, [dispatch, setOpenSnackBar, fetchData]);

    const rows = users ? users.flatMap((user) => {
        const userToolMap = new Map();
        return user.messages.flatMap((message, messageIndex) =>
            user.aiTools.flatMap((aiTool) =>
                aiTool.tools.map((toolId) => {
                    const category = aiTools.find(cat => cat._id === aiTool.category);
                    const tool = category ? category.tools.find(t => t._id === toolId) : null;

                    // Create a unique key for each tool
                    const toolKey = `${category ? category.category : ''}-${tool ? tool.title : ''}`;

                    // If this tool hasn't been added for this user yet, add it
                    if (!userToolMap.has(toolKey)) {
                        userToolMap.set(toolKey, true);
                        return {
                            id: `${user._id}-${messageIndex}-${aiTool.category}-${toolId}`,
                            userId: user._id,
                            email: user.email,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            message: message.content,
                            category: category ? category.category : 'Loading...',
                            toolId: toolId,
                            toolName: tool ? tool.title : 'Loading...',
                            toolDescription: tool ? tool.description : 'Loading...',
                            toolUrl: tool ? tool.url : '#',
                            hitCount: tool ? tool.hitCount : 'Loading...',
                            addedBy: tool ? tool.addedBy : 'Loading...',
                        };
                    }
                    return null;
                }).filter(Boolean) // Remove null entries
            )
        );
    }) : [];

    const emailMap = new Map();
    let sno = 1;

    // Assign S.No. to each unique email
    rows.forEach(row => {
        if (!emailMap.has(row.email)) {
            emailMap.set(row.email, sno++);
        }
    });

    // Add sno field to each row based on the unique email
    const rowsWithSno = rows.map(row => ({
        ...row,
        sno: emailMap.get(row.email)
    }));

    // console.log("rows: ", rowsWithSno);

    const columns = [
        { field: 'sno', headerName: 'S.No.', width: 70, sortable: false },
        { field: 'email', headerName: 'User Email', width: 200 },
        { field: 'firstName', headerName: 'First Name', width: 120 },
        { field: 'lastName', headerName: 'Last Name', width: 120 },
        {
            field: 'message',
            headerName: 'Message',
            width: 200,
            renderCell: (params) => (
                <div className="whitespace-normal">{params.value}</div>
            ),
        },
        { field: 'category', headerName: 'Category', width: 150 },
        {
            field: 'toolName',
            headerName: 'Tool Name',
            width: 150,
            renderCell: (params) => (
                <a
                    href={params.row.toolUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                >
                    {params.value}
                </a>
            ),
        },
        {
            field: 'toolId',
            headerName: 'Tool ID',
            width: 220,
            renderCell: (params) => (
                <span className="text-xs">{params.value}</span>
            ),
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
                        onClick={() => handleDelete(params.row.userId, params.row.toolId)}
                        className={`p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200  transition-colors duration-200`}
                    >
                        <TrashIcon className='h-5 w-5' />
                    </button>
                </div>
            )
        },
    ];

    if (status === 'loading' && !users) {
        return <Loading />;
    }

    if (error) {
        return <NetworkError error={error} />;
    }
    
    return (
        <div className="h-fit w-full bg-white shadow-md rounded-lg overflow-hidden">
            <DataGrid
                rows={rowsWithSno}
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

            <UserToolModal
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

export default UserDataTable;