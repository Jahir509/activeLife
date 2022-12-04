import { observer } from 'mobx-react-lite';
import React, { ChangeEvent, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import { Button, Form, Segment } from 'semantic-ui-react'
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { useStore } from '../../../app/stores/store';




export default observer (

  function ActivityForm() {

    const {activityStore} = useStore();
  
    const {loading,createActivity,updateActivity,loadActivity,loadingInitial} = activityStore
    
    const {id} = useParams<{id:string}>();
  
    let blankObject = {id:'',title:'',category:'',date:'',city:'',venue:'',description:''}
    
    // const initialState = selectedActivity || blankObject
  
    const [activity, setActivity] = useState(blankObject);

    useEffect(()=>{
      if(id) loadActivity(id).then((activity)=> setActivity(activity!))
    },[id,loadActivity])
  
    function handleSubmit(){
      console.log(loading)
      activity.id ? updateActivity(activity) : createActivity(activity)
    }
  
    function handleInputChange(event:ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)
    {
      const {name,value} = event.target
      setActivity({...activity,[name]: value})
    }
  
    if(loadingInitial) return <LoadingComponent inverted={false} content={'Loading Data'}/>
  
    return (
      <Segment clearing>
          <Form onSubmit={handleSubmit} autoComplete='off'>
              <Form.Input placeholder="Title" onChange={handleInputChange}  value={activity.title} name='title' />
              <Form.TextArea placeholder="Description" onChange={handleInputChange} value={activity.description} name="description" />
              <Form.Input placeholder="Category" onChange={handleInputChange} value={activity.category} name="category" />
              <Form.Input type='date' placeholder="Date" onChange={handleInputChange} value={activity.date} name="date" />
              <Form.Input placeholder="City" onChange={handleInputChange} value={activity.city} name="city" />
              <Form.Input placeholder="Venue" onChange={handleInputChange} value={activity.venue} name="venue" />
              <Button loading={loading} floated='right' positive type='submit' content="Submit" />
              <Button as={Link} to={`/activities/${activity.id}`} floated='right' type='button' content="Cancel" />
          </Form>
      </Segment>
    )
  }
  
)
