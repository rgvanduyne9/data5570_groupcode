import React from 'react';
import { View, StyleSheet } from 'react-native';
import { List } from 'react-native-paper';
import { schools } from '../config/schools';

export default function SchoolList({ onSelectSchool }) {
  return (
    <View style={styles.container}>
      {Object.values(schools).map((school) => (
        <List.Item
          key={school.id}
          title={school.name}
          onPress={() => onSelectSchool(school.id)}
          left={props => <List.Icon {...props} icon="school" />}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});
