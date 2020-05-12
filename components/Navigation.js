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
                <Stack hideNavBar>
                    {/* These are all regular screens */}
                    <Scene key="root" navigationBarStyle={{ backgroundColor: '#15b9ff', height: 50 }}>
                        <Scene key="login" component={Login} initial={true} hideNavBar />
                        <Scene key="registration" component={Registration} hideNavBar />
                        <Scene key="mainScreen" component={MainScreen} hideNavBar />
                    </Scene>
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