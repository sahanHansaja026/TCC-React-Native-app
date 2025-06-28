import { SafeAreaView, StyleSheet, Image, TouchableOpacity, Text } from "react-native";
import { Link } from 'expo-router';
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function Index() {

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Image source={require('./images/rice field-bro.png')} style={styles.image} />
        <TouchableOpacity style={styles.signupbtn}>
          <Link href="/(auth)/signup"><Text style={styles.signuptext}>Signup</Text></Link>
        </TouchableOpacity>
        <TouchableOpacity style={styles.loginbtn}>
          <Link href="/(auth)"><Text style={styles.logintext}>Login</Text></Link>
        </TouchableOpacity>
      </SafeAreaView>
    </SafeAreaProvider>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 450,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  loginbtn: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    width: 250,
    marginBottom: 20,
    borderWidth: 2, 
    borderColor:'#000'
  },
  signupbtn: {
    backgroundColor: '#000',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    width: 250,
    borderWidth: 2,
    borderColor: '#000',
    marginBottom:20,
  },
  logintext: {
    color: '#000',
    fontSize: 20,
  },
  signuptext: {
    color: '#fff',
    fontSize:20,
  }
});
