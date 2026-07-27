import { createSlice } from "@reduxjs/toolkit";
import Cookies from 'js-cookie'


export let loginSlice = createSlice({
    name:"Login",
    initialState:{
        user:Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null,
    },
    reducers:{
        login:function(state,request){
            let {payload} = request;
            state.user = payload;
            Cookies.set("user",JSON.stringify(state.user));
        },
        logout:function(state,request){
            state.user = null;
            Cookies.remove("user");
        }
    }
    
})

export default loginSlice.reducer;
export const {login,logout} = loginSlice.actions;

