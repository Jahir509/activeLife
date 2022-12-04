import React, { Fragment, useEffect } from 'react';
import {Container} from 'semantic-ui-react';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import LoadingComponent from './LoadingComponent';
import { useStore } from '../stores/store';
import { observer } from 'mobx-react-lite';
import { Route, useLocation } from 'react-router-dom';
import Homepage from '../../features/home/Homepage';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ActivityDetails from '../../features/activities/details/ActivityDetails';

function App() {

  // for route track
  const location = useLocation()

  return (
    <Fragment>
      {/* <NavBar />
      <Container style={{marginTop:'7rem'}}>
        <ActivityDashboard />
      </Container> */}
      <NavBar />
      <Container style={{ marginTop: '7em' }}>
          <Route exact path='/' component={Homepage}/>
          <Route exact path='/activities' component={ActivityDashboard} />
          <Route path='/activities/:id' component={ActivityDetails} />
          <Route key={location.key} path={['/createActivity','/manage/:id']} component={ActivityForm} />
      </Container>
    </Fragment>
  );
}

export default observer(App);
