import { configureStore } from '@reduxjs/toolkit';
import shopReducer from '../slices/shopSlice';

const shopStore = configureStore({
    reducer: {
        shop: shopReducer,
    },
});

export default shopStore;
