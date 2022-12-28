import { Formik,Form } from 'formik';
import { observer } from 'mobx-react-lite'
import React, { useEffect } from 'react'
import { Link } from 'react-router-dom';
import {Segment, Header, Comment, Button} from 'semantic-ui-react'
import InputTextArea from '../../../app/common/form/InputTextArea';
import { useStore } from '../../../app/stores/store';

interface Props{
    activityId: string;
}

export default observer(function ActivityDetailedChat({activityId} :Props) {

    const {commentStore} = useStore();

    useEffect(()=>{
        if(activityId){
            commentStore.createHubConnection(activityId);
        }
        return ()=>{
            commentStore.stopHubConnection();
        }
    },[commentStore,activityId])

    return (
        <>
            <Segment
                textAlign='center'
                attached='top'
                inverted
                color='teal'
                style={{border: 'none'}}
            >
                <Header>Chat about this event</Header>
            </Segment>
            <Segment attached clearing>
                <Comment.Group>
                    <>
                        {commentStore.comments.map(comment => {
                            <Comment>
                                <Comment.Avatar src={comment.image || '/assets/user.jpg'}/>
                                <Comment.Content>
                                    <Comment.Author as={Link} to={`/profiles/${comment.userName}`}>{comment.displayName}</Comment.Author>
                                    <Comment.Metadata>
                                        <div>{comment.createdAt}</div>
                                    </Comment.Metadata>
                                    <Comment.Text>{comment.body}</Comment.Text>
                                </Comment.Content>
                            </Comment>
                        })}
                        
                        <Formik
                            onSubmit={(values, { resetForm }) =>
                                commentStore.addComment(values).then(() => resetForm())}
                                initialValues={{body:''}}        
                        >
                            {({isSubmitting,isValid})=> (
                                <Form className='ui form'>
                                    <InputTextArea placeholder='Add comment ....' name='body' rows={2} />
                                    <Button
                                        loading={isSubmitting}
                                        disabled={ isSubmitting || !isValid }
                                        content='Add Reply'
                                        labelPosition='left'
                                        icon='edit'
                                        primary
                                        type='submit'
                                        floated='right'
                                    />
                                </Form>
                            )}
                        </Formik>
                    </>
                </Comment.Group>
            </Segment>
        </>

    )
})