import React from 'react';
import { Grid, List } from 'semantic-ui-react';
import { Activity } from '../../../models/activity';
import ActivityDetails from '../details/ActivityDetails';
import ActivityForm from '../form/ActivityForm';
import ActivityList from './ActivityList';

interface Props{
    activities: Activity[];
    selectedActivity: Activity | undefined;
    selectActivity: (id:string)=> void;
    cancelSelectActivity: ()=> void;
}


export default function ActivityDashboard(props: Props){
    return (
        <Grid>
            <Grid.Column width="10">
                <ActivityList 
                    activities={props.activities} 
                    selectedActivity={props.selectedActivity}
                    selectActivity={props.selectActivity}
                    cancelSelectActivity={props.cancelSelectActivity}
                />
            </Grid.Column>
            <Grid.Column width="6">
                {
                    props.selectedActivity &&
                    <ActivityDetails activity={props.selectedActivity} cancelSelectActivity={props.cancelSelectActivity} />
                }
                <ActivityForm/>
            </Grid.Column>
        </Grid>
    )
}