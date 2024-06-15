import React, {useState} from 'react';
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

const LoginCenter = ({ navigation }) => {
  const {height, width} = Dimensions.get('window');
  const registertion = () => {
    navigation.navigate("LoginPages");
  };

  const Login = () => {
    navigation.navigate("Login");
  };

  return (
    <View
    //   source={require('../Images/backgroundImage.jpg')}
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
        <Text style={styles.welcometext}>Welcome</Text>
        <TouchableOpacity style={styles.loginButton} onPress={registertion} >
          <Text style={styles.LoginText}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.loginButton} onPress={Login} >
          <Text style={styles.LoginText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
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
    marginLeft:"auto",
    marginRight:"auto",
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

export default LoginCenter;
