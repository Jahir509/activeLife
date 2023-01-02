import { HubConnection } from "@microsoft/signalr";
import { HubConnectionBuilder } from "@microsoft/signalr/dist/esm/HubConnectionBuilder";
import { LogLevel } from "@microsoft/signalr/dist/esm/ILogger";
import { makeAutoObservable, runInAction } from "mobx";
import { ChatComment } from "../../models/chatComment";
import { store } from "./store";

export default class CommentStore {
    comments:ChatComment[]=[]
    
    hubConnection: HubConnection | null = null;

    constructor() {
        makeAutoObservable(this);        
    }

    createHubConnection = (activityId:string)=> {
        if(store.activityStore.selectedActivity){
            this.hubConnection = new HubConnectionBuilder()
                .withUrl('http://localhost:5000/chat?activityId='+activityId,{
                    accessTokenFactory: ()=> store.userStore.user?.token!
                })
                .withAutomaticReconnect()
                .configureLogging(LogLevel.Information)
                .build();
            
            this.hubConnection.start()
                .catch(error=>{
                    console.log("Error Establishing the connection chathub",error);
                });
            
            this.hubConnection.on("LoadComments",(comments: ChatComment[]) => {
                runInAction(()=> {
                    console.log("I am loadComments")
                    console.log(comments)
                    this.comments = comments
                    console.log(this.comments)
                });
            });

            this.hubConnection.on("RecieveComment",(comment:ChatComment)=>{
                runInAction(()=> {
                    console.log("I am RecieveComment")
                    this.comments.push(comment)
                });
            })
        }
    }

    stopHubConnection = ()=> {
        this.hubConnection?.stop()
            .catch(error=>{
                console.log("Error Stopping Hub",error);
            })
    }

    clearComments = ()=> {
        this.comments = [];
        this.stopHubConnection();
    }

    addComment = async (values: any)=>{
        values.activityId = store.activityStore.selectedActivity?.id
        try {
            await this.hubConnection?.invoke("SendComment",values)
        } catch(error){
            console.log("Error occures while adding comment",error);
        }
    }

}