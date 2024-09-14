import React from 'react';
import { useDispatch } from 'react-redux';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Switch from '@mui/material/Switch';
import InputField from '../../InputField/InputField';
import { updateToolFromCategory, addAiTool } from '../../../redux/slices/aiTool';

export default function ToolModal({ open, handleClose, formData, setFormData, edit, setOpenSnackBar, isDark }) {
    const dispatch = useDispatch();

    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 500,
        color: isDark ? '#f3f4f6 ' : '#111827',
        backgroundColor: isDark ? '#111827' : '#f3f4f6 ',
        boxShadow: 24,
        p: 3.5,
        borderRadius: "10px"
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSwitch = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.checked });
    };

    const formatToolData = (data) => {
        return {
            title: data.title,
            description: data.description,
            url: data.url,
            hitCount: parseInt(data.hitCount),
            addedBy: data.addedBy,
            active: data.active
        };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!edit) {
            const { category, hitCount, ...toolData } = formData;
            const formattedData = {
                category: category,
                tools: [formatToolData({ ...toolData, hitCount: 0 })]
            };
            dispatch(addAiTool(formattedData));
        } else {
            const [categoryId, toolId] = formData.id.split('-');
            const { id, sno, category, ...updateData } = formData;
            const formattedData = formatToolData(updateData);
            dispatch(updateToolFromCategory({
                categoryId,
                toolId,
                updateData: formattedData
            }));
        }
        setOpenSnackBar(true);
        handleClose();
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={modalStyle}>
                <Typography id="modal-modal-title" variant="h5" sx={{ mb: 1 }} component="h2">
                    {edit ? "Edit Tool" : "Add Tool"}
                </Typography>
                <form onSubmit={handleSubmit} className="space-y-2">
                    <div className="grid grid-cols-1 gap-2">
                        <div className="grid grid-cols-2 gap-4">
                            <InputField
                                label="Category"
                                id="category"
                                type="text"
                                placeholder="Enter category"
                                name="category"
                                value={formData.category || ""}
                                onChange={handleChange}
                                required
                                isDarkMode={isDark}
                            />
                            <InputField
                                label="Tool Name"
                                id="title"
                                type="text"
                                placeholder="Enter tool name"
                                name="title"
                                value={formData.title || ""}
                                onChange={handleChange}
                                required
                                isDarkMode={isDark}
                            />
                        </div>
                        <div className="relative">
                            <InputField
                                label="URL"
                                id="url"
                                type="text"
                                placeholder="Enter URL"
                                name="url"
                                value={formData.url || ""}
                                onChange={handleChange}
                                required
                                isDarkMode={isDark}
                                className="pr-10"
                            />
                            {formData.url && (
                                <div className="absolute top-10 bg-inherit right-3 flex items-center pointer-events-none">
                                    <img
                                        src={`https://www.google.com/s2/favicons?domain=${formData.url}&sz=32`}
                                        alt="Website Icon"
                                        className="w-5 h-5"
                                    />
                                </div>
                            )}
                        </div>
                        <InputField
                            label="Description"
                            id="description"
                            placeholder="Enter description"
                            name="description"
                            value={formData.description || ""}
                            onChange={handleChange}
                            required
                            isTextarea
                            isDarkMode={isDark}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <InputField
                                label="Hit Count"
                                id="hitCount"
                                type="number"
                                placeholder="Enter hit count"
                                name="hitCount"
                                value={formData.hitCount || "0"}
                                onChange={handleChange}
                                required
                                isDarkMode={isDark}
                                min="0"
                            />
                            <InputField
                                label="Added By"
                                id="addedBy"
                                type="text"
                                placeholder="Enter added by"
                                name="addedBy"
                                value={formData.addedBy || ""}
                                onChange={handleChange}
                                required
                                isDarkMode={isDark}
                            />
                        </div>
                        <div className={`flex items-center justify-between p-3 rounded-md ${isDark ? 'bg-gray-800' : 'bg-gray-300'}`}>
                            <span className="font-medium">Tool Status:</span>
                            <div className="flex items-center">
                                <Switch
                                    checked={formData.active || false}
                                    name="active"
                                    onChange={handleSwitch}
                                    color="primary"
                                />
                                <span className="ml-2">
                                    {formData.active ? "Active" : "Inactive"}
                                </span>
                            </div>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className={`w-full p-3 rounded-md transition-colors duration-300 font-medium text-lg ${isDark
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                            }`}
                    >
                        {edit ? "Update Tool" : "Add Tool"}
                    </button>
                </form>
            </Box>
        </Modal>
    );
}