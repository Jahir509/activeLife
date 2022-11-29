import React, { Fragment, useEffect, useState } from 'react';
import axios from 'axios';
import {Container, List} from 'semantic-ui-react';
import { Activity } from '../../models/activity';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';

function App() {

  const [activities,setActivities] = useState<Activity[]>([]);

  const [selectedActivity,setSelectedActivity] = useState<Activity | undefined>(undefined);

  function handleSelectActivity(id:string){
      setSelectedActivity(activities.find(x=>x.id === id))
  }

  function cancelSelectActivity(){
      setSelectedActivity(undefined)
  }


  useEffect(()=>{
    axios.get<Activity[]>('http://localhost:5000/api/activities')
    .then(response=>{
      console.log(response)
      setActivities(response.data)
    })
  },[])

  return (
    <Fragment>
      <NavBar/>
      <Container style={{marginTop:'7rem'}}>
        <ActivityDashboard 
            activities={activities} 
            selectedActivity={selectedActivity}
            selectActivity={handleSelectActivity}
            cancelSelectActivity={cancelSelectActivity}
        />
      </Container>
    </Fragment>
  );
}

export default App;
