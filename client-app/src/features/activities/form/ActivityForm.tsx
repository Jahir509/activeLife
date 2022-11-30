import React, { ChangeEvent, useState } from 'react'
import { Button, Form, Segment } from 'semantic-ui-react'
import { Activity } from '../../../models/activity'

interface Props{
  activity: Activity | undefined
  closeForm: ()=> void
  createOrEdit: (activity: Activity)=> void;

}

export default function ActivityForm(props:Props) {
  let blankObject = {id:'',title:'',category:'',date:'',city:'',venue:'',description:''}
  
  const initialState = props.activity || blankObject

  const [activityInsite, setactivityInsite] = useState(initialState);

  function handleSubmit(){
    console.log(activityInsite)
    props.createOrEdit(activityInsite)
  }

  function handleInputChange(event:ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)
  {
    const {name,value} = event.target
    console.log(name,value)
    setactivityInsite({...activityInsite,[name]: value})
  }


  return (
    <Segment clearing>
        <Form onSubmit={handleSubmit} autoComplete='off'>
            <Form.Input placeholder="Title" onChange={handleInputChange}  value={activityInsite.title} name='title' />
            <Form.TextArea placeholder="Description" onChange={handleInputChange} value={activityInsite.description} name="description" />
            <Form.Input placeholder="Category" onChange={handleInputChange} value={activityInsite.category} name="category" />
            <Form.Input placeholder="Date" onChange={handleInputChange} value={activityInsite.date} name="date" />
            <Form.Input placeholder="City" onChange={handleInputChange} value={activityInsite.city} name="city" />
            <Form.Input placeholder="Venue" onChange={handleInputChange} value={activityInsite.venue} name="venue" />
            <Button floated='right' positive type='submit' content="Submit" />
            <Button floated='right' onClick={()=>props.closeForm()} type='button' content="Cancel" />
        </Form>
    </Segment>
  )
}
