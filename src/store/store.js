import { configureStore } from '@reduxjs/toolkit';
import categoriesReducer from './slices/categoriesSlice';
import customLegendsReducer from './slices/customLegendsSlice';

export const store = configureStore({
    reducer: {
        categories: categoriesReducer,
        customLegends: customLegendsReducer,
    },
});

export default store;
