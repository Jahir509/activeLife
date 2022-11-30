import React, { Fragment, useEffect, useState } from 'react';
import {Container} from 'semantic-ui-react';
import { Activity } from '../../models/activity';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import {v4 as uuid} from 'uuid';
import agent from '../api/agent';
import LoadingComponent from './LoadingComponent';

function App() {

  const [activities,setActivities] = useState<Activity[]>([]);
  const [selectedActivity,setSelectedActivity] = useState<Activity | undefined>(undefined);
  const [editMode,setEditMode] = useState(false);
  const [loading,setLoading] = useState(true)
  const [submitting,setSubmitting] = useState(false)

  function handleSelectActivity(id:string){
      setSelectedActivity(activities.find(x=>x.id === id))
  }

  function cancelSelectActivity(){
      setSelectedActivity(undefined)
  }

  function handleFormOpen(id?: string){
    id ? handleSelectActivity(id) : cancelSelectActivity()
    setEditMode(true)
  }

  function handleFormClose(){
    setEditMode(false)
  }

  function handleDeleteActivity(id:string){
    setSubmitting(true)
    agent.Activities.delete(id).then(()=>{
      setActivities([...activities.filter(x=>x.id !== id)])
      setSubmitting(false)
    })
  }

  function handleCreateOrEditActivity(activity: Activity){
    setSubmitting(true)
    if(activity.id){
      agent.Activities.update(activity).then(()=>{
        setActivities([...activities.filter(x=>x.id !== activity.id),activity]);
        setEditMode(false);
        setSelectedActivity(activity);
        setSubmitting(false)
      })
    }
    else{
      activity.id = uuid()
      agent.Activities.create(activity).then(()=>{
        setActivities([...activities,activity]);
        setEditMode(false);
        setSelectedActivity(activity);
        setSubmitting(false)
      })
    }

  }


  useEffect(()=>{
    agent.Activities.list()
    .then(response=>{
      response.map(x=> { 
        x.date = x.date.split('T')[0]
      })
      setActivities(response);
      setLoading(false);
    })
  },[])

if(loading) return <LoadingComponent inverted={true} content={'Loading App'} />


  return (
    <Fragment>
      <NavBar openForm={handleFormOpen}/>
      <Container style={{marginTop:'7rem'}}>
        <ActivityDashboard 
            activities={activities} 
            selectedActivity={selectedActivity}
            selectActivity={handleSelectActivity}
            cancelSelectActivity={cancelSelectActivity}
            openForm={handleFormOpen}
            closeForm={handleFormClose}
            editMode={editMode}
            createOrEdit={handleCreateOrEditActivity}
            deleteActivity={handleDeleteActivity}
            submitting={submitting}
        />
      </Container>
    </Fragment>
  );
}

export default App;
