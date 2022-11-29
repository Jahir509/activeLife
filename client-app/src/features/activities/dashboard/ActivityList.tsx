import React from 'react'
import { Button, Item, Label, Segment } from 'semantic-ui-react'
import { Activity } from '../../../models/activity'

interface Props{
    activities: Activity[];
    selectedActivity: Activity | undefined;
    selectActivity: (id:string)=> void;
    cancelSelectActivity: ()=> void;
}


export default function ActivityList(props:Props) {
  return (
    <Segment>
        <Item.Group divided>
            {props.activities.map((activity)=>(
               <Item key={activity.id}>
                    <Item.Content>
                        <Item.Header as='item-header'>{activity.title}</Item.Header>
                        <Item.Meta>{activity.date.toString()}</Item.Meta>
                        <Item.Description>
                            <div>{activity.description}</div>
                            <div>{activity.city},{activity.venue}</div>
                        </Item.Description>
                        <Item.Extra>
                            <Button onClick={()=>props.selectActivity(activity.id)} floated='right' content='View' color='blue' />
                            <Label basic content={activity.category} />
                        </Item.Extra>
                    </Item.Content>
               </Item> 
            ))}
        </Item.Group>
    </Segment>
  )
}
