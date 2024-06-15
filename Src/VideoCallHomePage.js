import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard,
  Image,
  Modal,
  Dimensions,
  PermissionsAndroid,
  Share,
  Button,
  Platform,
  LogBox,
  TouchableWithoutFeedback,
  ImageBackground,
} from 'react-native';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import {useNavigation} from '@react-navigation/native';

const {height, width} = Dimensions.get('window');

const InitialScreen = () => {
  const navigation = useNavigation();

  const handleStartVideoCall = () => {
    navigation.navigate('VideoCallScreen');
  };

  const Cancel = () => {
    navigation.goBack();
  };

  return (
    <ImageBackground
      source={require('../Images/back.jpg')} 
      style={styles.backgroundImage}>
      <View style={styles.container}>
        <View style={styles.avatarView}>
          <Image
            source={require('../Images/UserPhoto.jpg')}
            style={styles.avatar}
          />
        </View>
        <Text style={styles.title}>Username</Text>
        <TouchableOpacity style={styles.button} onPress={handleStartVideoCall}>
          <FontAwesome6
            name="video"
            size={30}
            color="black"
            style={styles.icon}
          />
          <Text style={styles.buttonText}>Start Video Call</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.Cancelview} onPress={Cancel}>
          <Text style={styles.Cancel}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarView: {
    width: 260,
    height: 260,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'pink',
    borderRadius: 150,
    marginBottom: 10,
  },
  avatar: {
    width: 250,
    height: 250,
    borderRadius: 150,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.75)', 
    textShadowOffset: { width: 2, height: 2 }, 
    textShadowRadius: 10, 
  },
  button: {
    width: '70%',
    height: 80,
    marginTop: 50,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    borderWidth: 1,  
    borderColor: 'black', 
  },
  buttonText: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
  },
  icon: {
    marginRight: 10,
  },
  Cancel: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
  },
  Cancelview: {
    width: '70%',
    height: 80,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    marginTop: 40,
    borderWidth: 1,  
    borderColor: 'black', 
  },
});

export default InitialScreen;
