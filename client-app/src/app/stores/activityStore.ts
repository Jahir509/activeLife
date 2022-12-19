import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Activity, ActivityFormValues } from "../../models/activity";
import { format } from "date-fns";
import { store } from "./store";
import { Profile } from "../../models/profile";

export default class ActivityStore {
    activityRegistry = new Map<string, Activity>();
    // activities: Activity[] = [];
    selectedActivity: Activity | undefined = undefined;
    editMode = false;
    loading = false;
    loadingInitial = false;

    constructor() {
        makeAutoObservable(this)
    }

    get activitiesByDate() {
        return Array.from(this.activityRegistry.values()).sort((a, b) => 
            // Date.parse(a.date) - Date.parse(b.date)); //this for string
            a.date!.getTime() - b.date!.getTime() ); //this for string
    }


    // Group By Date by this function

    get groupActivities(){
        return Object.entries(
            this.activitiesByDate.reduce((activities,activity)=>{
                const date = format(activity.date!,'dd-MMM-yyyy');
                activities[date] = activities[date] ? [...activities[date],activity] : [activity]
                return activities
            },{} as {[key:string] : Activity[]})
        )
    }

    loadActivities = async () => {
        this.loadingInitial = true
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

        const user = store.userStore.user;

        if(user){
            activity.isGoing = activity.attendees!.some((attendee => attendee.userName === user.userName ))
            activity.isHost = activity.hostUserName === user.userName
            activity.host = activity.attendees!.find(attendee=> attendee.userName === activity.hostUserName)
        }

        activity.date = new Date(activity.date!);
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

    createActivity = async (activity: ActivityFormValues) => {
        const user = store.userStore.user;
        const attendee = new Profile(user!);
        try {
            await agent.Activities.create(activity);
            const newActivity = new Activity(activity);
            newActivity.hostUserName = user!.userName;
            newActivity.attendees = [attendee]
            this.setActivity(newActivity);
            runInAction(() => {
                this.selectedActivity = newActivity;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    updateActivity = async (activity: ActivityFormValues) => {
        this.loading = true;
        try {
            await agent.Activities.update(activity);
            runInAction(() => {
                if(activity.id){
                    let updatedActivity = {...this.getActivity(activity.id),...activity}
                    this.activityRegistry.set(activity.id, updatedActivity as Activity);
                    this.selectedActivity = updatedActivity as Activity;
                }
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

        updateAttendance = async ()=> {
            const user = store.userStore.user
            this.loading = true
            try{
                await agent.Activities.attend(this.selectedActivity!.id)
                runInAction(()=>{
                    if(this.selectedActivity!.isGoing){
                        this.selectedActivity!.attendees = 
                            this.selectedActivity!.attendees?.filter(x=>x.userName !== user?.userName)
                        this.selectedActivity!.isGoing = false
                    } else {
                        const attendee = new Profile(user!)
                        this.selectedActivity?.attendees?.push(attendee)
                        this.selectedActivity!.isGoing = true;
                    }
                    this.activityRegistry.set(this.selectedActivity!.id,this.selectedActivity!)
                })
            }catch(error){
                console.log(error)
            }finally{
                runInAction(()=> this.loading = false)
            }
        }
    }

    
