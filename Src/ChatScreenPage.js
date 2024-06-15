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
import React, {useState} from 'react';
import {Dimensions} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const {height, width} = Dimensions.get('window');

const ChatScreenPage = ({navigation}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={30} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    height: height,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 60,
    backgroundColor: 'lightgray',
  },
});

export default ChatScreenPage;
