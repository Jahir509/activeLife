import { observer } from 'mobx-react-lite';
import React from 'react'
import { Link, NavLink } from 'react-router-dom';
import { Button, Container, Dropdown, Image, Menu } from 'semantic-ui-react'
import { useStore } from '../stores/store'



export default observer(
  function NavBar () {

    const {userStore: {user,logout}} = useStore();

    return (
      <Menu inverted fixed='top'>
        <Container>
            <Menu.Item as={NavLink} exact="true" to='/' header>
                <img src='/assets/logo.png' alt='logo' style={{marginRight:'10px'}}/>
                activeLife
            </Menu.Item>
            <Menu.Item as={NavLink} to='/activities' content='Activities' />
            <Menu.Item as={NavLink} to='/errors' content='Errors' />
            <Menu.Item>
                <Button as={NavLink} to='/createActivity' positive content='Create new Activity' />
            </Menu.Item>
            <Menu.Item position='right'>
                <Image src={user?.image || '/assets/user.jpg'} avatar spaced='right'/>
                <Dropdown pointing='top left' text={user?.displayName}>
                  <Dropdown.Menu>
                    <Dropdown.Item as={Link} to={`/profile/${user?.userName}`} text='My Profile' icon="user" />
                    <Dropdown.Item onClick={logout} text="logout" icon='power' />
                  </Dropdown.Menu>
                </Dropdown>
            </Menu.Item>
        </Container>
      </Menu>
    )
  }
)
