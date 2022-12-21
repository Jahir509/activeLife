import { observer } from 'mobx-react-lite';
import React from 'react'
import { Tab } from 'semantic-ui-react';
import ProfilePhoto from './ProfilePhoto';

export default observer(function ProfileContent() {
    const panes = [
        { menuItem: 'About', render: () => <Tab.Pane>About Content</Tab.Pane> },
        { menuItem: 'Photos', render: () => <ProfilePhoto />  },
        { menuItem: 'Events', render: () => <Tab.Pane>Events Content</Tab.Pane> },
        {
            menuItem: 'Followers',
            render: () => <Tab.Pane>Followers Content</Tab.Pane>
        },
        {
            menuItem: 'Following',
            render: () => <Tab.Pane>Following Content</Tab.Pane>
        }
    ];

    return (
        <Tab
            menu={{ fluid: true, vertical: true }}
            menuPosition='right'
            panes={panes}
        />
    )
})