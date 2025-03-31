import { configureStore } from '@reduxjs/toolkit';
import categoriesReducer from './slices/categoriesSlice';
import customLegendsReducer from './slices/customLegendsSlice';
import gameReducer from './slices/gameSlice';

export const store = configureStore({
    reducer: {
        categories: categoriesReducer,
        customLegends: customLegendsReducer,
        game: gameReducer,
    },
});

export default store;
