import { createSlice } from "@reduxjs/toolkit";

export const uiSlice = createSlice({
    name: 'ui',
    initialState: {
        isDateModalOpen: false,
    },
    reducers: {
        onOpenDateModal: (state) => {
            state.isDateModalOpen = true;
        },
        oncloseDateModal: (state) => {
            state.isDateModalOpen = false;
        },
    },
})

export const { 
    onOpenDateModal, 
    oncloseDateModal 
} = uiSlice.actions;