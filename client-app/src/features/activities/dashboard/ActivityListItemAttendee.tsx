import { observer } from 'mobx-react-lite'
import React from 'react'
import { Link } from 'react-router-dom'
import { Image,List, Popup } from 'semantic-ui-react'
import { Profile } from '../../../models/profile'
import ProfileCard from '../../profiles/ProfileCard'


interface Props {
    attendees: Profile[]
}


export default observer (
  function ActivityListItemAttendee({attendees}:Props) {
  
    const styles = {
        borderColor: 'orange',
        borderWidth: 3
    }
  
    return (
      <List horizontal>
          {attendees.map(attendee=>(
            <Popup
                hoverable
                key={attendee.userName}
                trigger={
                  <List.Item as={Link} to={`/profile/${attendee.userName}`}>
                      <Image size='mini'
                            style={attendee.following ? styles : null}
                            bordered
                            circular
                            src={attendee.image || `/assets/user.jpg`} />
                  </List.Item>
                }
            >
                <Popup.Content>
                    <ProfileCard profile={attendee} />
                </Popup.Content>
            </Popup>
          ))}
      </List>
    )
  }
)
