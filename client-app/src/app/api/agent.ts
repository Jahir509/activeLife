import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { Activity, ActivityFormValues } from "../../models/activity";
import { User, UserFormValues } from "../../models/user";
import { store } from "../stores/store";
import {router} from "../../routes/Routes";
import { Photo, Profile, UserActivity } from "../../models/profile";
import { PaginatedResult } from "../../models/pagination";


const sleep = (delay: number)=> {
    return new Promise((resolve)=>{
        setTimeout(resolve,delay)
    })
}


axios.defaults.baseURL = process.env.REACT_APP_API_URL;

const responseBody = <T> (response: AxiosResponse<T>)=> response.data;


// Request Interceptor
axios.interceptors.request.use(config => {
    const token = store.commonStore.token
    if(token && config.headers) config.headers.Authorization = `Bearer ${token}`
    return config
})


// Response Interceptor
axios.interceptors.response.use(async response => {
        if(process.env.NODE_ENV === 'development') await sleep(1000);
        const pagination = response.headers['pagination'];
        if(pagination){
            response.data = new PaginatedResult(response.data,JSON.parse(pagination))
            return response as AxiosResponse<PaginatedResult<any>>;
        }
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
    list: (params:URLSearchParams)=> axios.get<PaginatedResult<Activity[]>>(`/activities`,{params}).then(responseBody),
    details: (id:string)=> request.get<Activity>(`/activities/${id}`),
    create: (activity:ActivityFormValues)=> request.post<void>(`/activities`,activity),
    update: (activity:ActivityFormValues)=> request.put<void>(`/activities/${activity.id}`,activity),
    delete: (id:string)=> request.del<void>(`/activities/${id}`),
    attend: (id:string)=> request.post<void>(`/activities/${id}/attend`,{}),
}


const Account = {
    current: () => request.get<User>('account'),
    login: (user: UserFormValues) => request.post<User>('/account/login', user),
    register: (user: UserFormValues) => request.post<User>('/account/register', user)
}

const Profiles = {
    get: (username:string) => request.get<Profile>(`/profiles/${username}`),
    uploadPhoto: (file: any) => {
        let formData = new FormData();
        formData.append('File', file);
        return axios.post<Photo>('photos', formData, {
            headers: {'Content-Type': 'multipart/form-data'}
        })
    },
    setMainPhoto: (id: string) => request.post(`/photos/${id}/setMain`, {}),
    deletePhoto: (id: string) => request.del(`/photos/${id}`),
    updateProfile: (profile: Partial<Profile>) => request.put(`/profiles`,profile),
    updateFollowing: (username:string)=> request.post(`/follow/${username}`,{}),
    listFollowings: (username:string,predicate:string)=> request.get<Profile[]>(`/follow/${username}?predicate=${predicate}`),
    listActivities: (username: string, predicate: string) => request.get<UserActivity[]>(`/profiles/${username}/activities?predicate=${predicate}`)

}



const agent = {
    Activities,
    Account,
    Profiles,
}


export default agent;
