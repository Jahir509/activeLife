import React from 'react'
import { Link } from 'react-router-dom'
import { Image,List } from 'semantic-ui-react'
import { Profile } from '../../../models/profile'


interface Props {
    attendees: Profile[]
}


export default function ActivityListItemAttendee({attendees}:Props) {
  return (
    <List horizontal>
        {attendees.map(attendee=>(
            <List.Item key={attendee.userName} as={Link} to={`/profiles/${attendee.userName}`}>
                <Image size='mini' circular src= {attendee.image || '/assets/user.jpg'} />
            </List.Item>
        ))}
    </List>
  )
}
