import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { v4 as uuid } from 'uuid';
import { Activity } from "../../models/activity";
import { isThisTypeNode } from "typescript";

export default class ActivityStore {
    activityRegistry = new Map<string, Activity>();
    // activities: Activity[] = [];
    selectedActivity: Activity | undefined = undefined;
    editMode = false;
    loading = false;
    loadingInitial = true;

    constructor() {
        makeAutoObservable(this)
    }

    get activitiesByDate() {
        return Array.from(this.activityRegistry.values()).sort((a, b) => 
            Date.parse(a.date) - Date.parse(b.date));
    }

    loadActivities = async () => {
        try {
            const activities = await agent.Activities.list();
            activities.forEach(activity => {
                this.setActivity(activity)
                // activity.date = activity.date.split('T')[0];
                // this.activityRegistry.set(activity.id, activity);
                // this.activities.push(activity)
            })
            this.setLoadingInitial(false);
        } catch (error) {
            console.log(error);
            this.setLoadingInitial(false);
        }
    }

    loadActivity = async (id:string)=>{
        let activity = this.getActivity(id)
        if(activity){
            this.selectedActivity = activity
            return activity
        }else{
            this.loadingInitial = true;
            try{
                activity = await agent.Activities.details(id)
                this.setActivity(activity)
                runInAction(()=>{
                    this.selectedActivity = activity
                })
                this.setLoadingInitial(false)
                return activity
            } catch(err){
                console.log(err)
                this.setLoadingInitial(false)
            }
        }
    }

    private setActivity = (activity:Activity)=>{
        activity.date = activity.date.split('T')[0];
        this.activityRegistry.set(activity.id,activity)
    }

    private getActivity = (id:string)=> {
        return this.activityRegistry.get(id)
    }

    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    }

    selectActivity = (id: string) => {
        this.selectedActivity = this.activityRegistry.get(id);
        // this.selectedActivity= this.activities.find(x=>x.id === id)

    }

    cancelSelectedActivity = () => {
        this.selectedActivity = undefined;
    }

    openForm = (id?: string) => {
        id ? this.selectActivity(id) : this.cancelSelectedActivity();
        this.editMode = true;
    }

    closeForm = () => {
        this.editMode = false;
    }

    createActivity = async (activity: Activity) => {
        this.loading = true;
        activity.id = uuid();
        try {
            await agent.Activities.create(activity);
            runInAction(() => {
                this.activityRegistry.set(activity.id, activity);
                // this.activities.push(activity)
                this.selectedActivity = activity;
                this.editMode = false;
                this.loading = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    updateActivity = async (activity: Activity) => {
        this.loading = true;
        try {
            await agent.Activities.update(activity);
            runInAction(() => {
                this.activityRegistry.set(activity.id, activity);
                // this.activities = [...this.activities.filter(x=>x.id !== activity.id),activity]
                this.selectedActivity = activity;
                this.editMode = false;
                this.loading = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    deleteActivity = async (id: string) => {
        this.loading = true;
        try {
            await agent.Activities.delete(id);
            runInAction(() => {
                this.activityRegistry.delete(id);
                // this.activities = [...this.activities.filter(x=>x.id !== id)]
                // if (this.selectedActivity?.id === id) this.cancelSelectedActivity();
                this.loading = false;

            })
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            })
        }
    }
}