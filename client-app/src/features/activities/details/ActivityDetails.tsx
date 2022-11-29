import React from 'react'
import { Button, Card, Icon , Image} from 'semantic-ui-react'
import { Activity } from '../../../models/activity'

interface Props{
    activity: Activity;
    cancelSelectActivity: ()=> void;
}

export default function ActivityDetails(props:Props) {
  return (
    <Card>
        <Image src={`/assets/categoryImages/${props.activity.category}.jpg`} wrapped ui={false} />
        <Card.Content>
        <Card.Header>{props.activity.title}</Card.Header>
        <Card.Meta>
            <span className='date'>{props.activity.date.toString()}</span>
        </Card.Meta>
        <Card.Description>
            {props.activity.description}
        </Card.Description>
        </Card.Content>
        <Card.Content extra>
            <Button.Group widths='2'>
                <Button basic color='blue' content="Edit" />
                <Button onClick={()=>props.cancelSelectActivity()} basic color='red' content="Cancel" />
            </Button.Group>
        </Card.Content>
    </Card>
  )
}
