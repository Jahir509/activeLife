import { ErrorMessage, Form, Formik } from 'formik'
import { observer } from 'mobx-react-lite'
import { Button, Header } from 'semantic-ui-react'
import InputText from '../../app/common/form/InputText'
import { useStore } from '../../app/stores/store'
import * as Yup from 'yup';
import ValidationErrors from '../errors/ValidationErrors'

export default observer(
    function RegisterForm() {
        const {userStore} = useStore()

        return (
          <Formik
              initialValues={{displayName:'',userName:'', email:'',password:'',error: null}}
              onSubmit={(values,{setErrors})=>userStore.register(values)
                          .catch(error=>(setErrors({error})))
                        }
              validationSchema= {Yup.object({
                displayName: Yup.string().required(),
                userName: Yup.string().required(),
                email: Yup.string().required(),
                password: Yup.string().required(),
              })}
          >
            {({handleSubmit,isSubmitting,errors,isValid,dirty})=> (
              <Form className='ui form error' onSubmit={handleSubmit} autoComplete='off'>
                <Header as='h2' content='Sign up to activLife' color='teal' textAlign='center'/>
                <InputText placeholder='Display Name' name='displayName'/>
                <InputText placeholder='Username' name='userName'/>
                <InputText placeholder='Email' name='email'/>
                <InputText placeholder='Password' name='password' type='password'/>
                <ErrorMessage
                  name='error' render={()=>
                    <ValidationErrors errors={errors.error} />
                  }
                />
                <Button
                    disabled={!isValid || !dirty || isSubmitting    }
                    loading={isSubmitting} 
                    positive 
                    type='submit' 
                    content='Register'
                    fluid />
              </Form>
            )}
          </Formik>
        )
      }
)
