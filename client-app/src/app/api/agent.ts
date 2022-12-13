import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { Activity } from "../../models/activity";
import { User, UserFormValues } from "../../models/user";
import { store, useStore } from "../stores/store";
import {router} from "../../routes/Routes";

const sleep = (delay: number)=> {
    return new Promise((resolve)=>{
        setTimeout(resolve,delay)
    })
}


axios.defaults.baseURL = 'http://localhost:5000/api';

const responseBody = <T> (response: AxiosResponse<T>)=> response.data;

axios.interceptors.request.use(config => {
    const token = store.commonStore.token
    if(token && config.headers) config.headers.Authorization = `Bearer ${token}`
    return config
})

axios.interceptors.response.use(async response => {
        await sleep(1000);
        return response;
},(error: AxiosError)=>{
    const {data,status,config}: {data:any,status:number,config:any} = error.response!;
    switch(status){
        case 400:
            // toast.error('bad request');
            if(typeof data === 'string'){
                toast.error(data)
            }
            if(config.method === 'get' && data.errors.hasOwnProperty('id')){
               router.navigate('/not-found')
            }
            if(data.errors){
                const modelStateErrors = [];
                for(const key in data.errors){
                    if(data.errors[key]){
                        modelStateErrors.push(data.errors[key])
                    }
                }
            throw modelStateErrors.flat();
            }
            break;
        case 401:
            toast.error('unauthorised');
            break;
        case 404:
            // toast.error('not found');
           router.navigate('/not-found')
            break;
        case 500:
            //toast.error('srver error');
            store.commonStore.setServerError(data);
           router.navigate('/server-error')
            break;
    }
    return Promise.reject(error);
})


const request = {
    get:<T> (url:string)=> axios.get<T>(url).then(responseBody),
    post:<T> (url:string,body:{})=> axios.post<T>(url,body).then(responseBody),
    put:<T> (url:string,body:{})=> axios.put<T>(url,body).then(responseBody),
    del:<T> (url:string)=> axios.delete<T>(url).then(responseBody),
}

const Activities = {
    list: ()=> request.get<Activity[]>(`/activities`),
    details: (id:string)=> request.get<Activity>(`/activities/${id}`),
    create: (activity:Activity)=> request.post<void>(`/activities`,activity),
    update: (activity:Activity)=> request.put<void>(`/activities/${activity.id}`,activity),
    delete: (id:string)=> request.del<void>(`/activities/${id}`),
}


const Account = {
    current: () => request.get<User>('account'),
    login: (user: UserFormValues) => request.post<User>('/account/login', user),
    register: (user: UserFormValues) => request.post<User>('/account/register', user)
}

const agent = {
    Activities,
    Account
}


export default agent;
