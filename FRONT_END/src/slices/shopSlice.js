import { createSlice } from "@reduxjs/toolkit";

const shopSlice = createSlice({
    name: 'shop',
    initialState: {
        categoryId: '',
        brandId: '',
        myRef: null,
    },
    reducers: {
        setCategoryId: (state, action) => {
            state.categoryId = action.payload;
        },
        setBrandId: (state, action) => {
            state.brandId = action.payload;
        },
        setMyRef: (state, action) => {
            state.myRef = action.payload;
        },
    },
});

export const { setCategoryId, setBrandId, setMyRef } = shopSlice.actions;
export default shopSlice.reducer;
