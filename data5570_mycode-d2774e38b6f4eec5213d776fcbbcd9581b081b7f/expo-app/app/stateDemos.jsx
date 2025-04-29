import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Button, Text, TextInput, Card, Avatar, Divider } from 'react-native-paper';

const StateDemosComponent = () => {
  // State for showing/hiding image
  const [isImageVisible, setImageVisible] = useState(false);

  // State for counter
  const [counter, setCounter] = useState(0);

  // State for dynamic list
  const [text, setText] = useState('');
  const [items, setItems] = useState([]);

  // Handler for adding to the list
  const addItemToList = () => {
    if (text.trim()) {
      setItems([...items, text.trim()]);
      setText(''); // Clear the input field
    }
  };

  return (
    <View style={styles.container}>
      {/* Toggle Image Section */}
      <Card style={styles.section}>
        <Card.Title title="Toggle Image" left={(props) => <Avatar.Icon {...props} icon="image" />} />
        <Card.Content>
          {isImageVisible && (
            <Avatar.Image
              source={require('../assets/images/react-logo.png')}
              size={150}
              style={styles.image}
            />
          )}
          <Button
            mode="contained"
            onPress={() => setImageVisible(!isImageVisible)}
            style={styles.button}
          >
            {isImageVisible ? 'Hide Image' : 'Show Image'}
          </Button>
        </Card.Content>
      </Card>

      {/* Counter Section */}
      <Card style={styles.section}>
        <Card.Title title="Counter" left={(props) => <Avatar.Icon {...props} icon="counter" />} />
        <Card.Content>
          <Text variant="headlineMedium" style={styles.counterText}>
            Counter: {counter}
          </Text>
          <View style={styles.buttonRow}>
            <Button mode="outlined" onPress={() => setCounter(counter + 1)} style={styles.button}>
              Increment
            </Button>
            <Button mode="outlined" onPress={() => setCounter(counter - 1)} style={styles.button}>
              Decrement
            </Button>
          </View>
        </Card.Content>
      </Card>

      {/* Dynamic List Section */}
      <Card style={styles.section}>
        <Card.Title title="Dynamic List" left={(props) => <Avatar.Icon {...props} icon="format-list-bulleted" />} />
        <Card.Content>
          <TextInput
            label="Enter an item"
            mode="outlined"
            value={text}
            onChangeText={setText}
            style={styles.input}
          />
          <Button mode="contained" onPress={addItemToList} style={styles.button}>
            Add to List
          </Button>
          <FlatList
            data={items}
            keyExtractor={(item, index) => `${item}-${index}`}
            renderItem={({ item }) => (
              <View>
                <Text style={styles.listItem}>{item}</Text>
                <Divider />
              </View>
            )}
            style={styles.list}
          />
        </Card.Content>
      </Card>
    </View>
  );
};

export default StateDemosComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  section: {
    marginBottom: 20,
  },
  image: {
    alignSelf: 'center',
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
  },
  counterText: {
    textAlign: 'center',
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  input: {
    marginBottom: 10,
  },
  listItem: {
    padding: 10,
    fontSize: 16,
  },
  list: {
    marginTop: 10,
  },
});