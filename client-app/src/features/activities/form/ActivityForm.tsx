import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react'
import { Link, useHistory, useParams } from 'react-router-dom';
import { Button, Header, Segment } from 'semantic-ui-react'
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { useStore } from '../../../app/stores/store';
import { v4 as uuid } from 'uuid';
import { Formik,Form} from 'formik';
import * as Yup from 'yup';
import InputText from '../../../app/common/form/InputText';
import InputTextArea from '../../../app/common/form/InputTextArea';
import InputSelect from '../../../app/common/form/InputSelect';
import { categoryOptions } from '../../../app/common/options/categoryOptions';
import InputDate from '../../../app/common/form/InputDate';
import { Activity } from '../../../models/activity';




export default observer (

  function ActivityForm() {

    const history = useHistory();
    const {activityStore} = useStore();
    const {loading,createActivity,updateActivity,loadActivity,loadingInitial} = activityStore
    const {id} = useParams<{id:string}>();
    let blankObject = {id:'',title:'',category:'',date:null,city:'',venue:'',description:''}
    
    // const initialState = selectedActivity || blankObject

    const validationSchema = Yup.object({
      title: Yup.string().required('title is Required'),
      description: Yup.string().required('description is Required'),
      category: Yup.string().required('category is Required'),
      date: Yup.string().required('date is Required').nullable(),
      city: Yup.string().required('city is Required'),
      venue: Yup.string().required('venue is Required')
    })
  
    const [activity, setActivity] = useState<Activity>(blankObject);

    useEffect(()=>{
      if(id) loadActivity(id).then((activity)=> setActivity(activity!))
    },[id,loadActivity])
  
    function handleFormSubmit(activity: Activity){
      if(activity.id.length === 0 ){
        let newActivity = {
          ...activity,
          id: uuid()
        }
        createActivity(newActivity).then(()=>{
          history.push(`/activities/${newActivity.id}`)
        })

      }else{
        updateActivity(activity).then(()=>{
          history.push(`/activities/${activity.id}`)
        })
      }
    }
  
    // function handleChange(event:ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)
    // {
    //   const {name,value} = event.target
    //   setActivity({...activity,[name]: value})
    // }
  
    if(loadingInitial) return <LoadingComponent inverted={false} content={'Loading Data'}/>
  
    return (
      <Segment clearing>
          <Header content='Activity Details' sub color='teal' />
          <Formik 
              validationSchema={validationSchema}
              enableReinitialize
              initialValues={activity}
              onSubmit={values=> handleFormSubmit(values)}>
              {/* {({values: activity, handleChange,handleSubmit})=> ( */}
              {({handleSubmit,isValid,isSubmitting,dirty})=> (
                <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                  <InputText name='title' placeholder='Title' />
                  <InputTextArea rows={3} name="description" placeholder="Description" />
                  <InputSelect name="category" placeholder="Category" options={categoryOptions} />
                  <InputDate name="date" placeholderText="Date" showTimeSelect timeCaption='time' dateFormat='MMMM d, yyyy h:mm aa' />
                  <Header content='Location Details' sub color='teal' />
                  <InputText name="city" placeholder="City" />
                  <InputText name="venue" placeholder="Venue" />
                  <Button 
                      loading={loading}
                      disabled={isSubmitting || !dirty || !isValid }
                      floated='right'
                      positive type='submit'
                      content="Submit" 
                  />
                  <Button as={Link} to={`/activities/${activity.id}`} floated='right' type='button' content="Cancel" />
                </Form>
              )}
          </Formik>
      </Segment>
    )
  }
  
)
