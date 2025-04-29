import React from 'react';
import { View, StyleSheet, ImageBackground, ScrollView } from 'react-native';
import { useForm } from 'react-hook-form';
import { useRouter } from 'expo-router';
import { Button, Card, Text } from 'react-native-paper';
import { FormBuilder } from 'react-native-paper-form-builder';
import { useDispatch } from 'react-redux';
import { createUser } from '@/state/userSlice';

export default function Index() {
  const router = useRouter();
  const dispatch = useDispatch();

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      first_name: '',
      last_name: '',
      phone_number: '',
      email: '',
      school: 'utah state university',
    },
  });

  const colorOptions = [
    { label: 'Utah State University', value: 'utah state university' },
    { label: 'University of Texas El Paso', value: 'university of texas el paso' },
    { label: 'Texas A&M University', value: 'texas a&m university' },
    { label: 'Air Force Academy', value: 'air force academy' },
    { label: 'McNeese State University', value: 'mcneese state university' },
    { label: 'Vanderbilt University', value: 'vanderbilt university' },
    { label: 'San Jose State University', value: 'san jose state university' },
    { label: 'New Mexico State University', value: 'new mexico state university' },
    { label: 'Nevada Wolf Pack', value: 'nevada wolf pack' },
    { label: 'University of Nevada Las Vegas', value: 'university of nevada las vegas' },
    { label: 'Fresno State University', value: 'fresno state university' },
    { label: 'Boise State University', value: 'boise state university' },
  ];
    

  const onSubmit = (data) => {
    // Dispatch the new user data to the Redux store
    dispatch(createUser(data));

    console.log('New User Entry:', data);
    reset(); // Reset the form after submission
    router.push('overview_p2/'); // Navigate to overview page
  };

  return (
    <View style={styles.splitContainer}>
      <ImageBackground 
        source={require('@/assets/sport-bg.webp')} 
        style={styles.backgroundLeft}
        resizeMode="cover"
      >
        <View style={styles.overlay} />
      </ImageBackground>
      <ImageBackground 
        source={require('@/assets/sport-bg.webp')}
        style={styles.backgroundRight}
        resizeMode="cover"
      >
        <View style={styles.overlay} />
      </ImageBackground>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.contentContainer}>
          <View style={styles.header}>
            <Text variant="headlineMedium" style={styles.headerText}>SCOUT STREAM</Text>
            <Text variant="titleSmall" style={styles.subheaderText}>Your Ultimate Sports Hub</Text>
          </View>
          <Card style={styles.card}>
            <Card.Title 
              title="User Registration" 
              titleStyle={styles.cardTitle}
              subtitle="Join the game"
              subtitleStyle={styles.cardSubtitle}
            />
            <Card.Content>
              <FormBuilder
                control={control}
                setFocus={() => {}}
                formConfigArray={[
                  {
                    name: 'first_name',
                    type: 'text',
                    textInputProps: {
                      label: 'First Name',
                      mode: 'outlined',
                      style: styles.input,
                    },
                    rules: {
                      required: 'First name is required',
                    },
                  },
                  {
                    name: 'last_name',
                    type: 'text',
                    textInputProps: {
                      label: 'Last Name',
                      mode: 'outlined',
                      style: styles.input,
                    },
                    rules: {
                      required: 'Last name is required',
                    },
                  },
                  {
                    name: 'phone_number',
                    type: 'text',
                    textInputProps: {
                      label: 'Phone Number',
                      mode: 'outlined',
                      keyboardType: 'phone-pad',
                      style: styles.input,
                    },
                    rules: {
                      required: 'Phone number is required',
                      pattern: {
                        value: /^[0-9\-+() ]{7,15}$/,
                        message: 'Invalid phone number',
                      },
                    },
                  },
                  {
                    name: 'email',
                    type: 'text',
                    textInputProps: {
                      label: 'Email (Optional)',
                      mode: 'outlined',
                      keyboardType: 'email-address',
                      style: styles.input,
                    },
                    rules: {
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Invalid email address',
                      },
                    },
                  },
                  {
                    name: 'school',
                    type: 'select',
                    textInputProps: {
                      label: 'University',
                      mode: 'outlined',
                      style: styles.input,
                    },
                    options: colorOptions,
                    rules: {
                      required: 'Please select your university',
                    },
                  },
                ]}
              />

              <Button
                mode="contained" 
                buttonColor="#1a237e"
                onPress={handleSubmit(onSubmit)}
                style={styles.submitButton}
                labelStyle={styles.buttonText}
              >
                Log In
              </Button>

              <Button
                mode="outlined"
                onPress={() => router.push('overview_p2/')}
                style={styles.skipButton}
                textColor="#1a237e"
              >
                Skip Login
              </Button>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  splitContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 40,
  },
  backgroundLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: '50%',
    bottom: 0,
  },
  backgroundRight: {
    position: 'absolute',
    top: 0,
    left: '50%',
    right: 0,
    bottom: 0,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  contentContainer: {
    width: '100%',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  headerText: {
    fontWeight: 'bold',
    color: '#ffffff',
    fontSize: 32,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  subheaderText: {
    color: '#ffffff',
    marginTop: 5,
    fontSize: 16,
  },
  card: {
    padding: 10,
    borderRadius: 10,
    maxWidth: 400,
    alignSelf: 'center',
    width: '90%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    marginTop: 20,
  },
  cardTitle: {
    color: '#1a237e',
    fontWeight: 'bold',
  },
  cardSubtitle: {
    color: '#666',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  submitButton: {
    marginTop: 20,
    width: '50%',
    alignSelf: 'center',
    borderRadius: 25,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  skipButton: {
    marginTop: 10,
    width: '50%',
    alignSelf: 'center',
    borderRadius: 25,
    borderColor: '#1a237e',
  },
});