import React from 'react'
import { Link,router } from 'expo-router';
import authService from '../services/authService';
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

export default function Signup() {
  const [email, onChangeEmail] = React.useState('');
  const [password, onChangePassword] = React.useState('');
  const [username, onChangeUsername] = React.useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log({ username, email, password }); // ✅ Confirm values are valid
      await authService.register({ username, email, password });
      router.push('/(auth)');
    } catch (error) {
      console.error("Registration failed", error.response?.data || error.message);
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
              onChangeText={onChangeUsername}
              placeholder="Username"
              value={username}
              keyboardType="username"
              autoCapitalize="none"
            />
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
              <Link href="/(auth)">
                <Text style={styles.createtext}>Log in my Account</Text>
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
    marginBottom: 20,
  },
  submitbtn: {
    backgroundColor: '#000',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 20,
    alignItems: 'center',
  },
  createtext: {
    color: '#000',
    fontSize: 18,
  },
});