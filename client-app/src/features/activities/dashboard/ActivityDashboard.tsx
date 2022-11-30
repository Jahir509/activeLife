import React from 'react';
import { Grid } from 'semantic-ui-react';
import { Activity } from '../../../models/activity';
import ActivityDetails from '../details/ActivityDetails';
import ActivityForm from '../form/ActivityForm';
import ActivityList from './ActivityList';

interface Props{
    activities: Activity[];
    selectedActivity: Activity | undefined;
    selectActivity: (id:string)=> void;
    cancelSelectActivity: ()=> void;
    openForm: (id:string)=> void;
    closeForm: ()=> void;
    editMode: boolean;
    createOrEdit: (activity: Activity)=> void;
    deleteActivity: (id:string)=> void;
    submitting:boolean
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
                    deleteActivity={props.deleteActivity}
                    submitting={props.submitting}
                />
            </Grid.Column>
            <Grid.Column width="6">
                {
                    props.selectedActivity && !props.editMode &&
                    <ActivityDetails 
                        activity={props.selectedActivity}
                        cancelSelectActivity={props.cancelSelectActivity}
                        openForm={props.openForm} />
                }
                {props.editMode &&
                    <ActivityForm closeForm={props.closeForm} activity={props.selectedActivity} createOrEdit={props.createOrEdit} submitting={props.submitting}/>
                }
                
            </Grid.Column>
        </Grid>
    )
}