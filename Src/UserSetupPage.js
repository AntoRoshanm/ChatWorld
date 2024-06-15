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
  Platform,
  Modal,
} from 'react-native';
import {Dimensions} from 'react-native';
import {firebase} from './Firebase/Firebase';
import ImagePicker from 'react-native-image-crop-picker';


const UserSetupPage = ({route, navigation}) => {
  const {height, width} = Dimensions.get('window');
  const [modalVisible, setModalVisible] = useState(false);
  const [imageUrl, setImageUrl] = useState("https://images.rawpixel.com/image_png_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTA4L3Jhd3BpeGVsX29mZmljZV8zNF9mdWxsX2JvZHlfM2RfYXZhdGFyXzNkX3JlbmRlcl9vZl9hX2J1c2luZXNzd19jOWYzODYxYy1lZTYzLTQxOGYtOThmNC02MWJkNGM3OGE1YTZfMS5wbmc.png")
  const [UserName, setUserName] = useState('');
  const [Description, setDescription] = useState('');

  const NextButton = async() => {
    InputValue();
    await nextData();
  };

  const InputValue = () => {
    if (!UserName) {
      Alert.alert('Error', 'Please enter User name.');
    } else {
      navigation.navigate('MainPages');
    }
  };

  const nextData = async() => {
    const { UserID, userPassword } = route.params;
  try {
    // Reference to the user's data in Firebase
    const userRef = firebase.firestore().collection('ChatWorld').doc(UserID);

    console.log('UserID:', UserID);
    console.log('userPassword:', userPassword);
    console.log('UserName:', UserName);
    console.log('Description:', Description);
    console.log('imageUrl:', imageUrl);

    // Update the user data in Firebase
    await userRef.set({
      UserID,
      userPassword,
      UserName,
      Description,
      imageUrl,
    });

    // Navigate to the main page or any other destination
    navigation.navigate('MainPages');
  } catch (error) {
    console.error('Error saving user data to Firebase:', error);
    Alert.alert('Error', 'Failed to save user data. Please try again.');
  }
  };
  
  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleOption1 = async () => {
    closeModal();
    try {
      const image = await ImagePicker.openCamera({
        compressImageMaxWidth: 300,
        compressImageMaxHeight: 400,
        cropping: true,
        compressImageQuality: 0.7,
      });

      console.log(image);
      setImageUrl(image.path);
    } catch (error) {
      console.error('Error picking image from camera:', error);
    }
  };

  const handleOption2 = async () => {
    closeModal();
    try {
      const image = await ImagePicker.openPicker({
        compressImageMaxWidth: 300,
        compressImageMaxHeight: 400,
        compressImageQuality: 0.7,
        cropping: true,
      });

      console.log(image);
      setImageUrl(image.path);
    } catch (error) {
      console.error('Error picking image from gallery:', error);
    }
  };

  return (
    <View
      style={{
        width: width,
        height: height,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <TouchableOpacity style={styles.AvartarBtn} onPress={openModal} >
        <Image
          source={{uri:imageUrl}}
          style={styles.companyLogo}
        />
      </TouchableOpacity>
      <Text style={styles.chooseFontText} >Choose the Profile</Text>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={handleOption1} style={styles.optionButton}>
              <Text>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleOption2} style={styles.optionButton}>
              <Text>Choose File</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <Text>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View>
        <TextInput placeholder='Nick name' style={styles.UserNickname} value={UserName} onChangeText={text => setUserName(text)} />
        <TextInput placeholder='Description...' style={styles.Description} value={Description} onChangeText={text => setDescription(text)} />
      </View>
      <View>
        <TouchableOpacity style={styles.loginButton} onPress={NextButton} >
          <Text style={styles.nextbtn}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    AvartarBtn: {
    width: 210,
    height: 210,
    backgroundColor: 'blue',
    borderRadius: 150,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'white',
    borderWidth: 3,
  },
  companyLogo: {
    width: 180,
    height: 180,
    borderRadius: 150,
  },
  chooseFontText:{
    fontSize:20,
    color:"black",
    marginTop:5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: 300,
  },
  optionButton: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: 'lightblue',
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: 'red',
    borderRadius: 5,
    alignItems: 'center',
  },
  UserNickname:{
    width: 300,
    height: 60,
    borderColor: 'grey',
    borderWidth: 1,
    marginBottom: 16,
    paddingLeft: 20,
    paddingRight: 8,
    fontSize: 20,
    borderRadius: 30,
    color: 'black',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginTop:10,
  },
  Description:{
    width: 300,
    height: 100,
    borderColor: 'grey',
    borderWidth: 1,
    marginBottom: 16,
    paddingLeft: 20,
    paddingRight: 8,
    fontSize: 20,
    borderRadius: 20,
    color: 'black',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginTop:10,
  },
  loginButton:{
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
  nextbtn:{
    fontSize:25,
    fontWeight:"800",
  },
});

export default UserSetupPage;
