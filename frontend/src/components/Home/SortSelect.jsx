import React from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Menu, MenuItem } from '@mui/material';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import { ArrowDownIcon } from '@heroicons/react/24/solid';

const SortSelect = ({ theme, sortCriteria, handleSortChange }) => {
    const isDarkMode = theme === "dark";

    const handleMenuItemClick = (value, popupState) => {
        handleSortChange({ target: { value } });
        popupState.close();
    };

    const getSortLabel = (criteria) => {
        switch (criteria) {
            case 'dateDesc': return 'Newest First';
            case 'dateAsc': return 'Oldest First';
            case 'alphaAsc': return 'A-Z';
            case 'alphaDesc': return 'Z-A';
            default: return 'Sort by';
        }
    };

    return (
        <Box sx={{ minWidth: 100 }}>
            <PopupState variant="popover" popupId="sort-popup-menu">
                {(popupState) => (
                    <React.Fragment>
                        <Button
                            variant="contained"
                            {...bindTrigger(popupState)}
                            sx={{
                                backgroundColor: isDarkMode ? '#1f2937 ' : '#fff',
                                color: isDarkMode ? '#fff' : '#000',
                                '&:hover': {
                                    backgroundColor: isDarkMode ? '#374151' : '#d1d5db',
                                },
                                display: 'flex',
                                alignItems: 'center',
                                alignContent: 'center',
                                maxWidth: 200,
                                minWidth: 150,
                            }}
                            aria-label="Sort options"

                        >
                            {getSortLabel(sortCriteria)}
                            <ArrowDownIcon style={{ width: 15, height: 15, marginLeft: 8 }} />
                        </Button>
                        <Menu {...bindMenu(popupState)}>
                            <MenuItem onClick={() => handleMenuItemClick('dateDesc', popupState)}>Newest First</MenuItem>
                            <MenuItem onClick={() => handleMenuItemClick('dateAsc', popupState)}>Oldest First</MenuItem>
                            <MenuItem onClick={() => handleMenuItemClick('alphaAsc', popupState)}>A-Z</MenuItem>
                            <MenuItem onClick={() => handleMenuItemClick('alphaDesc', popupState)}>Z-A</MenuItem>
                        </Menu>
                    </React.Fragment>
                )}
            </PopupState>
        </Box>
    );
};

SortSelect.propTypes = {
    theme: PropTypes.oneOf(['dark', 'light']).isRequired,
    sortCriteria: PropTypes.oneOf(['dateDesc', 'dateAsc', 'alphaAsc', 'alphaDesc']).isRequired,
    handleSortChange: PropTypes.func.isRequired,
};

export default SortSelect;