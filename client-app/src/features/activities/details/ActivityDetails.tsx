import React from 'react'
import { Button, Card, Image} from 'semantic-ui-react'
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { useStore } from '../../../app/stores/store';



export default function ActivityDetails() {


  const {activityStore} = useStore();
  const {selectedActivity:activity,openForm,cancelSelectedActivity} = activityStore  

  if(!activity) return (
    <LoadingComponent inverted={true} content={'loading'} />
  );
  
  return (
    <Card>
        <Image src={`/assets/categoryImages/${activity.category}.jpg`} wrapped ui={false} />
        <Card.Content>
        <Card.Header>{activity.title}</Card.Header>
        <Card.Meta>
            <span className='date'>{activity.date}</span>
        </Card.Meta>
        <Card.Description>
            {activity.description}
        </Card.Description>
        </Card.Content>
        <Card.Content extra>
            <Button.Group widths='2'>
                <Button onClick={()=>openForm(activity.id)} basic color='blue' content="Edit" />
                <Button onClick={()=>cancelSelectedActivity()} basic color='red' content="Cancel" />
            </Button.Group>
        </Card.Content>
    </Card>
  )
}
