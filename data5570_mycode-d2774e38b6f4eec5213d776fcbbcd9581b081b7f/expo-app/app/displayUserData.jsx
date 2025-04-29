import React, { useEffect } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { Card, Paragraph, Button } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsers, deleteUser } from '@/state/userSlice';

export default function DisplayUserData() {
  const dispatch = useDispatch();
  const { formDataList, status, error } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchUsers()); // Fetch users on component mount
  }, []);

  if (status === 'loading') return <Paragraph>Loading...</Paragraph>;
  if (error) return <Paragraph>Error: {error}</Paragraph>;

  return (
    <ScrollView style={styles.container}>
      {formDataList.length > 0 ? (
        formDataList.map((user) => (
          <Card key={user.id} style={styles.card}>
            <Card.Title title={`${user.first_name} ${user.last_name}`} />
            <Card.Content>
              <Paragraph>Phone Number: {user.phone_number}</Paragraph>
              <Paragraph>Email: {user.email || 'N/A'}</Paragraph>
              <Paragraph>Favorite Color: {user.favorite_color}</Paragraph>
            </Card.Content>
            <Card.Actions>
              <Button onPress={() => dispatch(deleteUser(user.id))} mode="contained">
                Remove
              </Button>
            </Card.Actions>
          </Card>
        ))
      ) : (
        <Paragraph style={styles.noData}>No user data available.</Paragraph>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  card: {
    marginBottom: 10,
  },
  noData: {
    textAlign: 'center',
    marginTop: 20,
  },
});