export const CHANGE_LOADING = 'APP_STATE_CHANGE_LOADING';
export const CHANGE_PAGE = 'APP_STATE_CHANGE_PAGE';
export const CHANGE_FILTER_STATUS = 'APP_STATE_CHANGE_FILTER_STATUS';
export const CHANGE_FILTER_TEXT = 'APP_STATE_CHANGE_FILTER_TEXT';

export const updateLoadingState = (loading) => ({ type: CHANGE_LOADING, loading });
export const updatePagination = (page) => ({ type: CHANGE_PAGE, page });
export const updateFilterStatus = (status) => ({ type: CHANGE_FILTER_STATUS, status });
export const updateFilterText = (text) => ({ type: CHANGE_FILTER_TEXT, text });
