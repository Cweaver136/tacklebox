import React, { Component } from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import * as firebase from 'firebase';
import { titleCase } from './helpers/helpers';
import prettyMS from 'pretty-ms';

export default class HistoryView extends Component {


    constructor(props) {

        super(props);
        this.state = {
            entriesWithFish: [],
            entriesWithoutFish: [],
            showEmptySessions: false
        };
        console.ignoredYellowBox = [
            'Setting a timer'
        ];

    }

    componentDidMount() {
        console.log(this.props)
        let entries = [];
        Object.entries(this.props.sessions).forEach(([key, value]) => {
            if (value.fishCaught) entries.push(value)
        })
        this.setState({ entriesWithFish: entries })
    }

    render() {
        return (
            <View style={styles.dataView}>
                <FlatList
                    data={this.state.entriesWithFish}
                    renderItem={({ item, index }) => (
                        <View key={item.key} style={styles.historyEntry}>
                            <Text style={styles.historyEntryHeader}>{new Date(item.date).toLocaleDateString()}</Text>
                            <View style={styles.historyFishContainer}>
                                {Object.entries(item.fishCaught).sort((a, b) => a[1].type.localeCompare(b[1].type)).map(fish => {
                                    let key = fish[0];
                                    let data = fish[1];
                                    return (
                                        <Text style={styles.fishEntry}>{titleCase(data.type)} - {data.length} inches</Text>
                                    )
                                })}
                            </View>
                        </View>
                    )}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    historyEntry: {
        width: '100%',
        marginVertical: 10
    },

    historyEntryHeader: {
        borderBottomColor: 'black',
        borderBottomWidth: 2,
        fontWeight: "bold",
        fontSize: 22
    },

    historyFishContainer: {
        paddingVertical: 5,
        paddingHorizontal: 10
    },

    fishEntry: {
        fontSize: 16
    },

    dataView: {
        width: '100%',
        height: '100%',
    },
})
