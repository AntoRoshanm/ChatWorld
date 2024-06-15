import React, {useState, useEffect} from 'react';
import {
  View,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Keyboard,
  LogBox,
  ScrollView,
  FlatList,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import ImagePicker from 'react-native-image-crop-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Video from 'react-native-video-controls';

LogBox.ignoreLogs(['Image path is null or undefined']);

const {height, width} = Dimensions.get('window');

const ImagePreviewScreen = ({
  imageUrl,
  onClose,
  onSendMessage,
  navigation,
  route,
}) => {
  const [bottom, setBottom] = useState(false);
  const [inputText, setInputText] = useState('');
  const [galleryImages, setGalleryImages] = useState([]);
  const [selectedThumbnail, setSelectedThumbnail] = useState(imageUrl);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const sendImage = () => {
    if (
      imageUrl ||
      (galleryImages && galleryImages.length > 0) ||
      inputText ||
      selectedVideo
    ) {
      const newMessage = {
        text: inputText,
        image: imageUrl
          ? galleryImages
            ? [imageUrl, ...galleryImages]
            : [imageUrl]
          : galleryImages
            ? [...galleryImages]
            : [],
        video: selectedVideo ? selectedVideo : null,
      };

      navigation.navigate('GlobalChatScreen', {
        image: newMessage.image,
        text: newMessage.text,
        video: newMessage.video ? newMessage.video : null,
      });

      onClose();
    }
  };

  const goBack = () => {
    onClose();
  };

  const plusBotton = () => {
    setBottom(!bottom);
  };

  const Pluscancelbutton = async () => {
    setBottom(!bottom);
  };

  const usertextCamera = async () => {
    ImagePicker.openCamera({
      compressImageMaxWidth: 500,
      compressImageMaxHeight: 500,
      multiple: true,
    }).then(images => {
      console.log(images);

      if (images && images.length > 0) {
        setGalleryImages(prevImages => [
          ...prevImages,
          ...images.map(image => image.path),
        ]);
      }
    });
  };

  const userGalleryOpen = () => {
    ImagePicker.openPicker({
      compressImageMaxWidth: 500,
      compressImageMaxHeight: 500,
      multiple: true,
      mediaType: 'any',
    }).then(media => {
      if (media && media.length > 0) {
        const video = media.find(
          item => item.mime && item.mime.startsWith('video/'),
        );
        if (video) {
          setSelectedVideo(video.path);
        } else {
          setGalleryImages(prevImages => [
            ...prevImages,
            ...media
              .filter(item => item.mime && item.mime.startsWith('image/'))
              .map(image => image.path),
          ]);
        }
      }
    });
  };

  // const handleImageClick = selectedImage => {
  //   setSelectedThumbnail(selectedImage);
  // };

  const handleImageClick = selectedMedia => {
    if (selectedMedia.endsWith('.mp4')) {
      setSelectedVideo(selectedMedia);
      setSelectedThumbnail(null); // Clear image thumbnail for videos
    } else {
      setSelectedThumbnail(selectedMedia);
      setSelectedVideo(null);
    }
  };

  const cropAndRotateImage = async () => {
    try {
      const croppedImage = await ImagePicker.openCropper({
        path: selectedThumbnail,
        width: 300,
        height: 400,
        freeStyleCropEnabled: true,
      });
      setSelectedThumbnail(croppedImage.path);
    } catch (error) {
      console.log('Error cropping image:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headericons}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Ionicons name="arrow-back-outline" size={30} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={cropAndRotateImage}>
          <MaterialCommunityIcons name="crop-rotate" size={30} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.bothimageandvideo}>
        {selectedVideo ? (
          <Video
            source={{uri: selectedVideo}}
            style={styles.video}
            controls={true}
            paused={true}
            resizeMode="contain"
          />
        ) : selectedThumbnail ? (
          <Image
            source={{uri: selectedThumbnail}}
            style={styles.image}
            resizeMode="cover"
          />
        ) : null}
      </View>
      <View style={styles.smallselectimgaeview}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.smallScrollView}>
          {/* Images and Video Thumbnails */}
          {imageUrl && (
            <TouchableOpacity onPress={() => handleImageClick(imageUrl)}>
              <Image source={{uri: imageUrl}} style={styles.SelectedImage} />
            </TouchableOpacity>
          )}
          {galleryImages.map((media, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleImageClick(media)}>
              {media.endsWith('.mp4') ? (
                // For videos, show the video without thumbnail
                <Video
                  source={{uri: media}}
                  style={styles.VideoThumbnail}
                  controls={true}
                  paused={true}
                  resizeMode="contain"
                />
              ) : (
                // For images, show the actual image
                <Image source={{uri: media}} style={styles.SelectedImage} />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <KeyboardAvoidingView
        behavior="padding"
        style={styles.rowcontentContainer}>
        {bottom && (
          <>
            <View style={styles.bottomboxone}>
              <TouchableOpacity
                style={styles.camerplusicon}
                onPress={usertextCamera}>
                <Ionicons
                  name="camera"
                  size={30}
                  color="black"
                  style={{marginLeft: 25}}
                />
                <Text
                  style={{
                    marginLeft: 15,
                    fontSize: 19,
                    fontWeight: '400',
                    color: 'black',
                    fontSize: 19,
                    fontWeight: '400',
                    color: 'black',
                  }}>
                  Camera
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.imageplusicon}
                onPress={userGalleryOpen}>
                <Ionicons
                  name="image-outline"
                  size={30}
                  color="black"
                  style={{marginLeft: 25}}
                />
                <Text
                  style={{
                    marginLeft: 15,
                    fontSize: 19,
                    fontWeight: '400',
                    color: 'black',
                  }}>
                  Add Photo
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.Accountplusicon}>
                <MaterialCommunityIcons
                  name="account-circle"
                  size={30}
                  color="black"
                  style={{marginLeft: 25}}
                />
                <Text
                  style={{
                    marginLeft: 15,
                    fontSize: 19,
                    fontWeight: '400',
                    color: 'black',
                  }}>
                  Tag Person
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.bottomboxtwo}
              onPress={Pluscancelbutton}>
              <Text style={styles.canceltext}>Cancel</Text>
            </TouchableOpacity>
          </>
        )}
        <View style={styles.rowcontent}>
          <TouchableOpacity style={styles.cameraicon} onPress={plusBotton}>
            <Entypo name="plus" size={25} color="black" />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Type your message..."
            value={inputText}
            onChangeText={setInputText}
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendImage}>
            <Ionicons name="paper-plane" size={24} color="grey" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowcontentContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    marginBottom: 50,
  },
  image: {
    width: width,
    height: '60%',
    // marginTop: -20,
  },
  video: {
    width: width,
    height: '60%',
    // marginTop: -20,
  },
  bothimageandvideo: {
    width: width,
    height: '60%',
    marginTop: -20,
    justifyContent: 'center',
  },
  input: {
    height: 40,
    borderWidth: 1,
    width: '65%',
    borderColor: 'grey',
    borderRadius: 20,
    padding: 8,
    marginVertical: 10,
    backgroundColor: 'white',
    marginLeft: 5,
    color: 'black',
  },
  sendButton: {
    backgroundColor: '#DCF8c5',
    borderRadius: 30,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  rowcontent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  backButton: {
    // position: 'absolute',
    // top: 20,
    // left: 20,
    // zIndex: 1,
  },
  bottomboxone: {
    width: '90%',
    height: 230,
    borderRadius: 20,
    backgroundColor: '#BFBFBF',
    // position: 'absolute',
    bottom: 10,
    left: '0%',
    right: '5%',
  },
  bottomboxtwo: {
    width: '90%',
    height: 60,
    borderRadius: 20,
    // position: 'absolute',
    bottom: 0,
    left: '0%',
    right: '5%',
    backgroundColor: '#BFBFBF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  canceltext: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  camerplusicon: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    // backgroundColor: 'pink',
    height: 75,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 0,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 0,
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
  },
  imageplusicon: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    // backgroundColor: 'pink',
    height: 75,
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
  },
  Accountplusicon: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    // backgroundColor: 'pink',
    height: 75,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 20,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 20,
  },
  documentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#BFBFBF',
    padding: 10,
    borderRadius: 8,
    marginLeft: 8,
  },
  documentInfo: {
    marginLeft: 8,
  },
  documentName: {
    fontSize: 16,
    color: 'black',
  },
  documentSize: {
    fontSize: 12,
    color: 'black',
  },
  SelectedImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  VideoThumbnail: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  smallselectimgaeview: {
    width: width,
    marginTop: 10,
    // flexDirection: 'row',
  },
  smallselectimageviewrow: {
    alignItems: 'center',
  },
  headericons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: width,
    paddingHorizontal: 20,
    position: 'absolute',
    top: 30,
  },
  cameraicon: {
    backgroundColor: 'violet',
    borderRadius: 20,
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  smallselectimgaeviewContainer: {
    alignItems: 'center',
  },
  smallScrollView: {
    flexDirection: 'row',
    flexGrow: 1,
    justifyContent: 'center',
  },
});

export default ImagePreviewScreen;
