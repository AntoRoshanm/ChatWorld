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

const SecondPage = ({route, navigation}) => {
  const { Password, UserID, userPassword } = route.params;
  const [otpCode, setOtpCode] = useState('');
  const {height, width} = Dimensions.get('window');

  const verifyOtp = async () => {
    try {
      const response = await fetch('http://192.168.1.32:3000/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Password,
          otpCode,
        }),
      });

      const data = await response.json();

      if (data.otpStatus === 'approved') {
        // Navigate to the main pages if OTP verification is successful
        navigation.navigate('UserSetupPage', {
          UserID: UserID,
          userPassword: userPassword,
        });
      } else {
        Alert.alert('Error', 'Invalid OTP. Please try again.');
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
          <TextInput
            placeholder="Enter OTP"
            keyboardType="numeric"
            value={otpCode}
            onChangeText={text => setOtpCode(text)}
            style={styles.input}
          />
          <TouchableOpacity style={styles.loginButton} onPress={verifyOtp}>
            <Text style={styles.LoginText}>Verify</Text>
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

export default SecondPage;
