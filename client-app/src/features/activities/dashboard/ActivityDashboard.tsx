import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { Grid } from 'semantic-ui-react';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { useStore } from '../../../app/stores/store';
import ActivityList from './ActivityList';



export default observer ( 
    function ActivityDashboard(){

        const {activityStore} = useStore();
        const {loadingInitial,activityRegistry,loadActivities} = activityStore

        useEffect(()=>{
            if(activityRegistry.size <= 1 ) loadActivities();
        },[activityRegistry.size,loadActivities])

        if(loadingInitial) return <LoadingComponent inverted={true} content={'Loading App'} />

        return (
            <Grid>
                <Grid.Column width="10">
                    <ActivityList />
                </Grid.Column>
                <Grid.Column width="6">
                   <h1>Filter</h1>                 
                </Grid.Column>
            </Grid>
        )
    }
)