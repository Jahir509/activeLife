import React, { Fragment } from 'react';
import {Container} from 'semantic-ui-react';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import { observer } from 'mobx-react-lite';
import { Route, useLocation } from 'react-router-dom';
import Homepage from '../../features/home/Homepage';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ActivityDetails from '../../features/activities/details/ActivityDetails';
import TestErrors from '../../features/errors/TestErrors';
import { ToastContainer } from 'react-toastify';

function App() {

  // for route track
  const location = useLocation()

  return (
    <Fragment>
      <ToastContainer position='bottom-right' hideProgressBar />
      <Route exact path='/' component={Homepage}/>
      <Route
        path={'/(.+)'}
        render={()=>(
          <>
            <NavBar />
            <Container style={{ marginTop: '7em' }}>
                
                <Route exact path='/activities' component={ActivityDashboard} />
                <Route path='/activities/:id' component={ActivityDetails} />
                <Route key={location.key} path={['/createActivity','/manage/:id']} component={ActivityForm} />
                <Route path='/errors' component={TestErrors} />
            </Container>
          </>
        )}
      />
    </Fragment>
  );
}

export default observer(App);
