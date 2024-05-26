import { configureStore } from "@reduxjs/toolkit";


export const store = configureStore({
    reducer: {
        
    },
    middlewares: (configmdw) => configmdw()
})