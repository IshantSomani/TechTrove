import React, { useContext, useState } from 'react';
import { Container, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import AiToolsDataTable from './AiToolsDataTable';
import { ThemeContext } from '../../../context/ThemeContext';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const AdminAiTool = () => {
    const [open, setOpen] = useState(false);
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const { theme } = useContext(ThemeContext);
    const isDark = theme === 'dark';

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpenSnackBar(false);

    return (
        <div className={`${isDark ? 'bg-gray-900' : 'bg-gray-100'} min-h-screen`}>
            <Container maxWidth="lg">
                <div className={`flex justify-between items-center p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                    <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>AITOOLS</h1>
                    <button
                        className={`${isDark ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'} 
                                    text-white px-6 py-2 rounded-md font-medium transition duration-300 ease-in-out 
                                    transform hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 
                                    focus:ring-blue-600 focus:ring-opacity-50`}
                        onClick={handleOpen}
                    >
                        Add AITOOLS
                    </button>
                </div>

                <div className={isDark ? 'bg-gray-800' : 'bg-white'}>
                    <AiToolsDataTable open={open} setOpen={setOpen} setOpenSnackBar={setOpenSnackBar} isDark={isDark} />
                </div>

                <Snackbar
                    anchorOrigin={{ vertical: "top", horizontal: "center" }}
                    autoHideDuration={3000}
                    open={openSnackBar}
                    onClose={handleClose}
                >
                    <Alert
                        onClose={handleClose}
                        severity="success"
                        variant="filled"
                        sx={{ width: '100%' }}
                    >
                        AI TOOL Updated
                    </Alert>
                </Snackbar>
            </Container>
        </div>
    );
};

export default AdminAiTool;