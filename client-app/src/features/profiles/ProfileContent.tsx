import { observer } from 'mobx-react-lite';
import React from 'react'
import { Tab } from 'semantic-ui-react';
import { useStore } from '../../app/stores/store';
import { Profile } from '../../models/profile';
import ProfileAbout from './ProfileAbout';
import ProfileActivities from './ProfileActivities';
import ProfileFollowing from './ProfileFollowing';
import ProfilePhoto from './ProfilePhoto';

interface Props{
    profile: Profile;
}

export default observer(function ProfileContent({profile}:Props) {

    const {profileStore} = useStore();


    const panes = [
        { menuItem: 'About', render: () => <ProfileAbout /> },
        { menuItem: 'Photos', render: () => <ProfilePhoto profile={profile} />  },
        { menuItem: 'Events', render: () => <ProfileActivities /> },
        {
            menuItem: 'Followers',
            render: () => <ProfileFollowing />
        },
        {
            menuItem: 'Following',
            render: () => <ProfileFollowing />
        }
    ];

    return (
        <Tab
            menu={{ fluid: true, vertical: true }}
            menuPosition='right'
            panes={panes}
            onTabChange={(e, data) => profileStore.setActiveTab(data.activeIndex)}

        />
    )
})