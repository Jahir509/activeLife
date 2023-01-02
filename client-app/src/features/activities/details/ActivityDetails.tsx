import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react'
import {  useParams } from 'react-router-dom';
import { Grid} from 'semantic-ui-react'
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { useStore } from '../../../app/stores/store';
import ActivitityDetailedHeader from './ActivitityDetailedHeader';
import ActivityDetailedChat from './ActivityDetailedChat';
import ActivityDetailedInfo from './ActivityDetailedInfo';
import ActivityDetailedSidebar from './ActivityDetailedSidebar';



export default observer(
  function ActivityDetails() {


    const {activityStore} = useStore();
    const {selectedActivity:activity,loadActivity,loadingInitial,clearSelectedActivity} = activityStore  
    const {id} = useParams<{id:string}>();
  
    useEffect(()=>{
      if (id) loadActivity(id);
      return ()=> clearSelectedActivity()
    },[id,loadActivity,clearSelectedActivity])
  
    if(loadingInitial || !activity) return (
      <LoadingComponent inverted={true} content={'loading'} />
    );
  
  
    
    return (
      <Grid>
        <Grid.Column width={10}>
          <ActivitityDetailedHeader activity={activity}/>
          <ActivityDetailedInfo activity={activity} />
          <ActivityDetailedChat activityId={activity.id}/>
        </Grid.Column>

        <Grid.Column width={6}>
          <ActivityDetailedSidebar activity={activity}/>
        </Grid.Column>

      </Grid>

      // <Card fluid>
      //     <Image src={`/assets/categoryImages/${activity.category}.jpg`} wrapped ui={false} />
      //     <Card.Content>
      //     <Card.Header>{activity.title}</Card.Header>
      //     <Card.Meta>
      //         <span className='date'>{activity.date}</span>
      //     </Card.Meta>
      //     <Card.Description>
      //         {activity.description}
      //     </Card.Description>
      //     </Card.Content>
      //     <Card.Content extra>
      //         <Button.Group widths='2'>
      //             <Button as={Link} to={`/manage/${activity.id}`} basic color='blue' content="Edit" />
      //             <Button as={Link} to={`/activities`} basic color='red' content="Cancel" />
      //         </Button.Group>
      //     </Card.Content>
      // </Card>
    )
  }
)
