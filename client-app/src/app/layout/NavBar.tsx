import React from 'react'
import { Button, Container, Menu } from 'semantic-ui-react'

interface Props{
  openForm: ()=>void
}

export default function NavBar (props: Props) {
    return (
      <Menu inverted fixed='top'>
        <Container>
            <Menu.Item header>
                <img src='/assets/logo.png' alt='logo' style={{marginRight:'10px'}}/>
                activeLife
            </Menu.Item>
            <Menu.Item content='Activities' />
            <Menu.Item>
                <Button onClick={props.openForm} positive content='Create new Activity' />
            </Menu.Item>
        </Container>
      </Menu>
    )
  }
