import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Switch from '@mui/material/Switch';
import { aiToolsByUser } from '../../../redux/slices/user';
import InputField from '../../InputField/InputField';

const UserToolModal = ({ open, handleClose, formData, setFormData, edit, setOpenSnackBar, isDark }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.user);

  useEffect(() => {
    if (edit && formData) {
      setFormData({
        ...formData,
        fullName: `${formData.firstName || ''} ${formData.lastName || ''}`.trim(),
        title: formData.toolName || '',
        description: formData.toolDescription || '',
        url: formData.toolUrl || '',
        hitCount: formData.hitCount || 0,
        addedBy: formData.addedBy || '',
        active: formData.active || false,
      });
    }
  }, [edit, formData, setFormData]);

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    maxHeight: '90vh',
    overflowY: 'auto',
    color: isDark ? '#f3f4f6' : '#111827',
    backgroundColor: isDark ? '#1f2937' : '#ffffff',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    padding: '24px',
    borderRadius: '12px',
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSwitch = (e) => {
    const { name, checked } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: checked }));
  };

  const formatToolData = (data) => ({
    title: data.title,
    description: data.description,
    url: data.url,
    hitCount: parseInt(data.hitCount, 10),
    addedBy: data.addedBy,
    active: data.active,
    category: data.category,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user) {
      const toolData = formatToolData(formData);
      console.log("toolData: ", toolData)
      try {
        await dispatch(aiToolsByUser({ userId: formData.userId || user._id, aitool: toolData })).unwrap();
        setOpenSnackBar(true);
        handleClose();
      } catch (error) {
        console.error("Failed to add/update tool:", error);
        // Handle error (e.g., show error message to user)
      }
    } else {
      console.error("No user found");
      // Handle error (e.g., show error message to user)
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={modalStyle}>
        <Typography id="modal-modal-title" variant="h5" sx={{ mb: 3, fontWeight: 'bold' }} component="h2">
          {edit ? "Edit Tool" : "Add Tool"}
        </Typography>
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="User Email"
            id="email"
            type="email"
            placeholder="User Email"
            name="email"
            value={formData.email || ""}
            onChange={handleChange}
            required
            isDarkMode={isDark}
            disabled={edit}
          />
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
              type="url"
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
          <div className={`flex items-center justify-between p-3 rounded-md ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}>
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

export default UserToolModal;