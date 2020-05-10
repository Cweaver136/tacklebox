import React, { Component } from 'react';
import { Router, Scene, Stack, Lightbox } from "react-native-router-flux"

// screens to add to the router navigation
import Login from './Login';
import Registration from './Registration';
import MainScreen from './MainScreen';
import Drawer from './Drawer';

export default class Navigation extends Component {

    render() {
        return (
            <Router>
                <Stack>
                    <Lightbox hideNavBar>

                        {/* These are all regular screens */}
                        <Scene key="root">
                            <Scene key="login" component={Login} initial={true} hideNavBar />
                            <Scene key="registration" component={Registration} hideNavBar />

                            {/* This defines which screens will have the drawer */}
                            <Scene key="drawer" navigationBarStyle={{ backgroundColor: '#06531D' }} drawerPosition="left" contentComponent={Drawer} hideNavBar drawer={true} drawerWidth={200} >
                                <Scene key="mainScreen" component={MainScreen} navigationBarStyle={{ backgroundColor: '#06531D' }} titleStyle={{ color: '#FFFFFF' }} title="Lobby"/>
                            </Scene>
                        </Scene>

                        {/* These are the "modals" */}
                    </Lightbox>
                </Stack>
            </Router>
        );
    }
}

const styles = {
    lightbox: {
        margin: 25,
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },
}