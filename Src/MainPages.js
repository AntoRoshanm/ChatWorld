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
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';


const {height, width} = Dimensions.get('window');

const MainPages = ({navigation}) => {
  const [reels, setReels] = useState(false);
  const [search, setSearch] = useState(false);
  const [Home, setHome] = useState(false);
  const [Account, setAccount] = useState(false);

  const GlobalScreenbutton = () => {
    navigation.navigate('GlobalChatScreen');
  };

  const ReelsButton = () => {
    if (!reels) {
      setReels(true);
      setSearch(false);
      setHome(false);
      setAccount(false);
    }
  };

  const searchButton = () => {
    if (!search) {
      setSearch(true);
      setReels(false);
      setHome(false);
      setAccount(false);
    }
  };

  const HomeButton = () => {
    if (!Home) {
      setHome(true);
      setSearch(false);
      setReels(false);
      setAccount(false);
    }
  };

  const accountButton = () => {
    if (!Account) {
      setAccount(true);
      setSearch(false);
      setReels(false);
      setHome(false);
    }
  };

  const ChatScreenFun = () => {
    navigation.navigate('ChatScreenPage');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.Chattext}>𝒞𝒽𝒶𝓉𝒲𝑜𝓇𝓁𝒹</Text>
        <TouchableOpacity>
          <Ionicons name="search-outline" size={30} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.bottomBox}>
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={HomeButton}>
            <View style={[styles.iconTextContainer, Home && styles.selectedIcon]}>
              <Ionicons
                name={Home ? 'chatbubbles-sharp' : 'chatbubbles-outline'}
                size={30}
                color={Home ? '#007FFF' : 'black'}
              />
              <Text
                style={[styles.smallText, {color: Home ? 'black' : 'gray'}]}>
                Chats
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={ReelsButton}>
            <View style={[styles.iconTextContainer, reels && styles.selectedIcon]}>
              <Ionicons
                name={reels ? 'heart-sharp' : 'heart-outline'}
                size={30}
                color={reels ? 'red' : 'black'}
              />
              <Text
                style={[styles.smallText, {color: reels ? 'black' : 'gray'}]}>
                Storys
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={GlobalScreenbutton} style={styles.icon}>
            <View style={[styles.iconTextContainer, Account && styles.selectedIcon]}>
              <Fontisto
                name="world-o"
                size={30}
                color="black"
              />
              <Text
                style={[styles.smallText, {color: Account ? 'black' : 'gray'}]}>
                GlobalChat
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={searchButton}>
            <View style={[styles.iconTextContainer, search && styles.selectedIcon]}>
              <MaterialCommunityIcons
                name={search ? 'account-circle' : 'account-circle-outline'}
                size={30}
                color="black"
              />
              <Text
                style={[styles.smallText, {color: search ? 'black' : 'gray'}]}>
                Account
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    height: height,
    backgroundColor: "whitesmoke",
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 60,
    borderBottomWidth: 0.5,
    borderBottomColor: 'grey',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
  Chattext: {
    fontFamily: Platform.OS === 'android' ? 'YourCustomFontName' : 'Times New Roman',
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
    width: 200,
  },
  iconContainer: {
    flexDirection: 'row',
  },
  icon: {
    marginHorizontal: 10,
  },
  bottomBox: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    width: '90%',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 30,
    left: '5%',
    right: '5%',
    borderWidth: 0.5,
    borderColor: 'lightgray',
  },
  iconTextContainer: {
    alignItems: 'center',
    marginRight: 15,
    marginLeft: 15,
  },

  smallText: {
    fontSize: 12,
    marginTop: 5,
  },
});

export default MainPages;
