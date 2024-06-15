import React, {useState, useEffect} from 'react';
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
import {Dimensions} from 'react-native';
import {firebase} from './Firebase/Firebase';

const Login = ({ navigation }) => {
  const {height, width} = Dimensions.get('window');
  const [UserID, setUserID] = useState('');
  const [userPassword, setuserPassword] = useState('');
const todoRef = firebase.firestore().collection('ChatWorld');
const checkDataExistence = async () => {
  if (
    UserID &&
    UserID.length > 0 &&
    userPassword &&
    userPassword.length > 0
  ) {
    // Check if the user with the same email already exists
    todoRef
      .where('UserID', '==', UserID)
      .where('userPassword', '==', userPassword)
      .get()
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          // User with the same email already exists
          navigation.navigate('UserSetupPage', {
            UserID: UserID,
            userPassword: userPassword,
          });
        } else {
          // User does not exist, proceed to add the data
          Alert.alert('User is invalid Check UserId & Password or Register');
        }
      })
      .catch((error) => {
        alert(error);
      });
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
        <TextInput
          style={styles.input}
          placeholder="User ID..."
          value={UserID}
          onChangeText={text => setUserID(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Password..."
          value={userPassword}
          onChangeText={text => setuserPassword(text)}
        />
        <TouchableOpacity style={styles.loginButton} onPress={checkDataExistence} >
          <Text style={styles.LoginText}>Login</Text>
        </TouchableOpacity>
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
  welcometext: {
    fontSize: 35,
    color: 'black',
    marginLeft: 'auto',
    marginRight: 'auto',
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
    marginTop: 15,
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
    marginBottom: 25,
    marginTop: 15,
  },
  LoginText: {
    fontSize: 30,
    fontWeight: 'bold',
  },
});

export default Login;
