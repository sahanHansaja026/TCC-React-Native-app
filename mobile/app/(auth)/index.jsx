import {
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import React from 'react';
import { Link, router } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login() {
  const [email, onChangeEmail] = React.useState('');
  const [password, onChangePassword] = React.useState('');

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://10.0.2.2:9000/api/auth/login', {
        email,
        password,
      });

      await AsyncStorage.setItem('token', response.data.token);

      router.push('/(tab)'); // Navigate to another page
    } catch (error) {
      console.error('Login failed', error);
      if (error.response) {
        alert(`Login failed: ${error.response.data.error}`);
      } else {
        alert('Login failed: Network error or server not reachable');
        router.push('/(tab)')
      }
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={styles.scrollView}
            keyboardShouldPersistTaps="handled"
          >
            <Image source={require('../images/login.png')} style={styles.image} />

            <TextInput
              style={styles.input}
              onChangeText={onChangeEmail}
              placeholder="Email"
              value={email}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              onChangeText={onChangePassword}
              value={password}
              placeholder="Password"
              secureTextEntry={true}
            />
            <TouchableOpacity style={styles.submitbtn} onPress={handleSubmit}>
              <Text style={styles.text}>Submit</Text>
            </TouchableOpacity>
            <View style={styles.link}>
              <Link href="/signup">
                <Text style={styles.createtext}>Create New Account</Text>
              </Link>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    padding: 20,
    paddingBottom: 40,
    flexGrow: 1,
    justifyContent: 'center',
  },
  input: {
    height: 50,
    marginVertical: 10,
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  image: {
    width: '100%',
    height: 450,
    resizeMode: 'contain',
    marginBottom: -50,
  },
  submitbtn: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#000',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  text: {
    color: '#000',
    fontSize: 26,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 20,
    alignItems: 'center',
  },
  createtext: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
