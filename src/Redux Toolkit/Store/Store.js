import { configureStore } from "@reduxjs/toolkit";
import  loginSlice  from "../Slice/loginSlice";



export let store = configureStore({
    reducer:{
        login:loginSlice,
    }
})