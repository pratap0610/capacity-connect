import { getState, updateState } from './mockStore.js';
export const listUsers=()=>getState().users;
export const updateUser=(id,patch)=>{const users=getState().users.map(u=>u.id===id?{...u,...patch}:u);updateState({users});return users.find(u=>u.id===id);};
