import {
  View,
  Text,
  Image,
  Alert,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Linking,
} from 'react-native';
import React, {useState, useEffect } from 'react';
import {Dimensions} from 'react-native';
import {auth} from './Firebase/Firebase';
import {firebase} from './Firebase/Firebase';


const LoginPage = ({ navigation }) => {
  const {height, width} = Dimensions.get('window');
  const [username, setUsername] = useState('');
  const [UserID, setUserID] = useState('');
  const [Password, setPassword] = useState('');
  const [ userPassword, setuserPassword ] = useState('');
  const [otpCode, setOtpCode] = useState('');

  const LoginButton = async () => {
    InputValue();
    addField();
    // await sendOtp();
    };

  const InputValue = () => {
    if (!username && !UserID && !Password && !userPassword ) {
      Alert.alert('Error', 'Please enter the User name.');
    } else {
      // navigation.navigate('Otpverification', { Password });
    }
  };

const todoRef = firebase.firestore().collection('ChatWorld');
const addField = async() => {
  // Check if we have new field data
  if (
    UserID &&
    UserID.length > 0 &&
    Password &&
    Password.length > 0 &&
    userPassword &&
    userPassword.length > 0
  ) {
    // Check if the user with the same email already exists
    todoRef
      .where('UserID', '==', UserID)
      .get()
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          // User with the same email already exists
          Alert.alert('User with this email already exists');
        } else {
          // User does not exist, proceed to add the data
          const timestamp = firebase.firestore.FieldValue.serverTimestamp();
          const data = {
            UserID: UserID,
            Password: Password,
            userPassword: userPassword,
            createdAt: timestamp,
          };
          todoRef
            .add(data)
            .then(() => {
              setUserID('');
              setPassword('');
              setuserPassword('');
              navigation.navigate('Otpverification', { 
                UserID: UserID,
                userPassword: userPassword,
                Password:Password });
              sendOtp();
            })
            .catch((error) => {
              Alert.alert(error);
            });
        }
      })
      .catch((error) => {
        alert(error);
      });
  }
};


  const sendOtp = async () => {
    try {
      const response = await fetch('http://192.168.1.32:3000/send-sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Password
        }),
      });

      const data = await response.json();

      if (data.otpStatus === 'pending') {
        // Navigate to the second page if OTP sent successfully
        // navigation.navigate('SecondPage', { Password });
      } else {
        Alert.alert('Error', 'Failed to send OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };
  
    
  return (
    <ImageBackground
      source={require('../Images/backgroundImage.jpg')}
      style={{
        width: width,
        height: height,
        backgroundColor: 'wheat',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View style={styles.backgroundColorLogo}>
        <Image
          source={require('../Images/chatLogo.png')}
          style={styles.companyLogo}
        />
        <Text style={styles.companyLogoName}>ChatWorld</Text>
      </View>
      <View style={styles.inputValuestyle}>
          <>
            {/* <TextInput
              style={styles.input}
              placeholder="Name..."
              value={username}
              onChangeText={text => setUsername(text)}
            /> */}
            <TextInput
              style={styles.input}
              placeholder="New User ID..."
              value={UserID}
              onChangeText={text => setUserID(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Password..."
              value={userPassword}
              onChangeText={text => setuserPassword(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="+91 Mobile Number.."
              value={Password}
              onChangeText={text => setPassword(text)}
            />
            <TouchableOpacity style={styles.loginButton} onPress={LoginButton}>
              <Text style={styles.LoginText}>Login</Text>
            </TouchableOpacity>
          </>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  companyLogo: {
    width: 100,
    height: 100,
  },
  companyLogoName: {
    fontSize: 35,
    color: 'white',
  },
  backgroundColorLogo: {
    width: 250,
    height: 250,
    backgroundColor: 'wheat',
    borderRadius: 150,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'white',
    borderWidth: 3,
  },
  input: {
    width: 300,
    height: 60,
    borderColor: 'white',
    borderWidth: 1,
    marginBottom: 16,
    paddingLeft: 20,
    paddingRight: 8,
    fontSize: 20,
    borderRadius: 30,
    color: 'black',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  inputValuestyle: {
    marginTop: 20,
  },
  loginButton: {
    width: 300,
    height: 60,
    backgroundColor: 'red',
    borderRadius: 30,
    borderColor: 'grey',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  LoginText: {
    fontSize: 30,
    fontWeight: 'bold',
  },
});

export default LoginPage;
