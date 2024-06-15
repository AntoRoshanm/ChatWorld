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
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import ImagePicker from 'react-native-image-crop-picker';
import ImagePreviewScreen from './ImagePreviewScreen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DocumentPicker from 'react-native-document-picker';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import Slider from '@react-native-community/slider';
import RNFS from 'react-native-fs';
import {PinchGestureHandler, State} from 'react-native-gesture-handler';
import DocumentViewer from './DocumentViewer';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Video from 'react-native-video';

LogBox.ignoreLogs([
  'Animated.event now requires a second argument for options',
]);
LogBox.ignoreLogs(['Animated: `useNativeDriver` was not specified']);
const audioRecorderPlayer = new AudioRecorderPlayer();
const {height, width} = Dimensions.get('window');

const GlobalChatScreen = ({route, navigation}) => {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [bottom, setBottom] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [audioUri, setAudioUri] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioMessages, setAudioMessages] = useState([]);
  const [currentAudioIndex, setCurrentAudioIndex] = useState(null);
  const [audioRecordings, setAudioRecordings] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showImageOverlay, setShowImageOverlay] = useState(false);
  const [pinIcon, setPinIcon] = useState();
  const [pinIconMessage, setpinIconMessage] = useState('');
  const [isMessageLongPressed, setIsMessageLongPressed] = useState(false);
  const [correctIcon, setcorrectIcon] = useState();
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [messageIconStates, setMessageIconStates] = useState({});
  const [inputFocus, setInputFocus] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [longPressedMessageId, setLongPressedMessageId] = useState(null);
  const [fullScreenVideoUrl, setFullScreenVideoUrl] = useState(null);
  const [messageTextStyle, setMessageTextStyle] = useState({
    padding: 8,
    marginVertical: 4,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 0,
    backgroundColor: '#DCF8c5',
    maxWidth: '80%',
    alignSelf: 'flex-end',
    marginRight: 10,
    flexDirection: 'column',
  });

  const changeMessageStyle = () => {
    const newStyles = {
      padding: 8,
      marginVertical: 4,
      borderTopLeftRadius: 15,
      borderBottomLeftRadius: 15,
      borderTopRightRadius: 10,
      borderBottomRightRadius: 0,
      backgroundColor: '#DCF8c5',
      maxWidth: '80%',
      alignSelf: 'flex-end',
      marginRight: 40,
      flexDirection: 'column',
    };
    setMessageTextStyle(newStyles);
  };

  const [isModalVisibleVideo, setModalVisibleVideo] = useState(false);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

  const handleVideoPress = videoUrl => {
    setFullScreenVideoUrl(videoUrl);
    setModalVisibleVideo(true);
    setIsPlayingVideo(false);
  };

  const closeModal = () => {
    setFullScreenVideoUrl(null);
    setModalVisibleVideo(false);
    setIsPlayingVideo(false);
  };

  const playPauseToggleVideo = () => {
    setIsPlayingVideo(!isPlayingVideo);
  };

  // const handleVideoPress = (videoUrl) => {
  //   setFullScreenVideoUrl(videoUrl);
  // };

  const closeFullScreenVideo = () => {
    setFullScreenVideoUrl(null);
  };

  const textInputRef = useRef(null);

  useEffect(() => {
    if (textInputRef.current && inputFocus) {
      textInputRef.current.focus();
      setInputFocus(false);
    }
  }, [inputFocus]);

  const pinIcons = () => {
    setPinIcon(!pinIcon);
    setpinIconMessage(!pinIcon);

    setTimeout(() => {
      setpinIconMessage(false);
    }, 3000);
  };

  const pinIconfunction = () => {
    pinIcons();
  };

  const handleLongPress = messageId => {
    setIsMessageLongPressed(!isMessageLongPressed);
    changeMessageStyle();
    setSelectedMessageId(messageId);
  };

  const handleIconPress = messageId => {
    setMessageIconStates(prevStates => ({
      ...prevStates,
      [messageId]: !prevStates[messageId],
    }));
  };

  const handleLongPressCloseButton = () => {
    setIsMessageLongPressed(!isMessageLongPressed);
    setMessageTextStyle(!messageTextStyle);
    setSelectedMessageId(null);
  };

  // useEffect(() => {
  //   const {image, text, video} = route.params || {};
  //   if (image || text || video) {
  //     const newMessage = {text, image: image || [] , video};
  //     // const newMessage = {text, image: Array.isArray(image) ? image : [image]};
  //     // setMessages([...messages, newMessage]);
  //     setMessages((prevMessages) => [...prevMessages, newMessage]);
  //   }
  // }, [route.params]);

  useEffect(() => {
    const {image, text, video} = route.params || {};
    if (image || text || video) {
      const newMessage = {
        text,
        image: Array.isArray(image) ? image : [image], // Ensure image is an array
        video,
      };

      // Filter out video thumbnails from the image array
      newMessage.image = newMessage.image.filter(
        img => !img.startsWith('video/'),
      );

      setMessages(prevMessages => [...prevMessages, newMessage]);
    }
  }, [route.params]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setIsKeyboardOpen(true);
      },
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setIsKeyboardOpen(false);
      },
    );

    const keyboardWillShowListener = Keyboard.addListener(
      'keyboardWillShow',
      () => {
        setIsKeyboardOpen(true);
      },
    );

    const keyboardWillHideListener = Keyboard.addListener(
      'keyboardWillHide',
      () => {
        setIsKeyboardOpen(false);
      },
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, []);

  const sendMessage = () => {
    if (inputText || imageUrl || audioUri || selectedVideo) {
      const newMessage = {
        text: inputText,
        image: imageUrl,
        audio: audioUri,
        video: selectedVideo,
      };
      setMessages([...messages, newMessage]);
      setInputText('');
      setImageUrl('');
      setAudioUri('');
      setSelectedVideo(null);

      setIsKeyboardOpen(false);
      setInputFocus(true);
    }
  };

  const usertextCamera = async () => {
    try {
      const image = await ImagePicker.openCamera({
        compressImageMaxWidth: 500,
        compressImageMaxHeight: 500,
        cropping: true,
        compressImageQuality: 0.7,
      });
      console.log(image);
      if (image && image.path) {
        setImageUrl(image.path);
        setShowImagePreview(true);
        console.log('imageUrl:', imageUrl);
        console.warn('Image path is null or undefined.');
      }
    } catch (error) {
      console.error('Error picking image from camera:', error);
    }
  };

  const userGalleryOpen = () => {
    ImagePicker.openPicker({
      compressImageMaxWidth: 500,
      compressImageMaxHeight: 500,
      multiple: true,
      mediaType: 'any',
    }).then(images => {
      console.log(images);
      if (images && images.length > 0) {
        setImageUrl(images[0].path);
        setShowImagePreview(true);
      }
      if (images && images.length > 0) {
        setSelectedVideo(images[0].path);
      }
    });
  };

  const closeImagePreview = () => {
    setShowImagePreview(false);
  };

  const plusBotton = () => {
    setBottom(!bottom);
  };

  const Pluscancelbutton = async () => {
    setBottom(!bottom);
  };

  const pickDocument = async () => {
    try {
      const [result] = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });

      console.log('Complete Document Result:', result);

      // Log specific properties to check their values
      console.log('Document Name:', result.name);
      console.log('Document Size (bytes):', result.size);
      console.log('Document URI:', result.uri);

      const newDocument = {
        name: result.name || 'Untitled',
        size: result.size || 0,
        uri: result.uri || 'Unknown URI',
        type: result.type || 'application/octet-stream',
      };

      setSelectedDocuments([...selectedDocuments, newDocument]);
      console.log('Selected documents updated:', selectedDocuments);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('Document picking cancelled');
      } else {
        console.error('Error picking document:', err);
      }
    }
  };

  const formatFileSize = sizeInBytes => {
    if (sizeInBytes < 1024) {
      return Math.round(sizeInBytes) + ' B';
    } else if (sizeInBytes < 1024 * 1024) {
      return Math.round(sizeInBytes / 1024) + ' KB';
    } else if (sizeInBytes < 1024 * 1024 * 1024) {
      return Math.round(sizeInBytes / (1024 * 1024)) + ' MB';
    } else {
      return Math.round(sizeInBytes / (1024 * 1024 * 1024)) + ' GB';
    }
  };

  const openModal = document => {
    setSelectedDocument(document);
    setIsModalVisible(true);
  };

  const renderDocumentContent = () => {
    if (selectedDocument && selectedDocument.uri) {
      if (selectedDocument.type && selectedDocument.type.startsWith('image/')) {
        // Displaying an image
        return (
          <DocumentViewer
            document={selectedDocument}
            onClose={() => setIsModalVisible(false)}
            navigation={navigation}
          />
        );
      }
    } else {
      return <Text>No document content available</Text>;
    }
  };

  const startRecording = async () => {
    try {
      // Check audio recording permission
      const permissionResult = await check(PERMISSIONS.ANDROID.RECORD_AUDIO);

      if (permissionResult === RESULTS.GRANTED) {
        console.log('Audio recording permission granted');

        // Start recording
        const result = await audioRecorderPlayer.startRecorder();
        setIsRecording(true);
        console.log(result);
      } else {
        console.log(
          'Audio recording permission not granted. Requesting permission...',
        );

        // Request audio recording permission
        const permissionRequestResult = await request(
          PERMISSIONS.ANDROID.RECORD_AUDIO,
        );

        if (permissionRequestResult === RESULTS.GRANTED) {
          console.log('Audio recording permission granted after request');

          // Start recording
          const result = await audioRecorderPlayer.startRecorder();
          setIsRecording(true);
          console.log(result);
        } else {
          console.log('Audio recording permission denied');
        }
      }
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = async () => {
    try {
      const result = await audioRecorderPlayer.stopRecorder();
      setIsRecording(false);
      const startTimestamp = audioRecorderPlayer.currentTimestamp;
      const stopTimestamp = new Date().getTime();
      const durationInSeconds = Math.round(
        (stopTimestamp - startTimestamp) / 1000,
      );
      const formattedDuration = audioRecorderPlayer.mmssss(durationInSeconds);

      const newRecording = {
        uri: result,
        duration: formattedDuration,
        start: startTimestamp,
        stop: stopTimestamp,
      };

      setAudioRecordings([...audioRecordings, newRecording]);
      setAudioMessages([...audioMessages, newRecording]);

      console.log(result);
    } catch (error) {
      console.error('Error stopping recording:', error);
    }
  };

  const playRecording = async index => {
    try {
      const audioMessage = audioMessages[index];
      if (!audioMessage || !audioMessage.uri) {
        console.error('Audio message or URI is empty or undefined.');
        return;
      }
      const permissionResult = await check(PERMISSIONS.ANDROID.RECORD_AUDIO);
      if (permissionResult === RESULTS.GRANTED) {
        console.log('Audio permission granted');
        const result = await audioRecorderPlayer.startPlayer(audioMessage.uri);
        setCurrentAudioIndex(index);
        setIsPlaying(!isPlaying);
      } else {
        console.log('Audio permission not granted. Requesting permission...');
        const permissionRequestResult = await request(
          PERMISSIONS.ANDROID.RECORD_AUDIO,
        );

        if (permissionRequestResult === RESULTS.GRANTED) {
          console.log('Audio permission granted after request');
          const result = await audioRecorderPlayer.startPlayer(
            audioMessage.uri,
          );
          setCurrentAudioIndex(index);
          setIsPlaying(!isPlaying);
        } else {
          console.log('Audio permission denied');
        }
      }
    } catch (error) {
      console.error('Error playing recording:', error);
    }
  };

  useEffect(() => {
    return () => {
      audioRecorderPlayer.stopPlayer();
      audioRecorderPlayer.removeRecordBackListener();
      audioRecorderPlayer.removePlayBackListener();
    };
  }, []);

  const formatDuration = milliseconds => {
    if (isNaN(milliseconds) || milliseconds < 0) {
      return '0s';
    }

    const seconds = Math.round(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (minutes === 0) {
      return `${remainingSeconds}s`;
    }

    if (remainingSeconds === 0) {
      return `${minutes}m`;
    }

    return `${minutes}m ${remainingSeconds}s`;
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: 'ChatWorld',
        url: selectedImage.uri,
        title: 'Document Sharing',
      });
    } catch (error) {
      console.error('Error sharing document:', error.message);
    }
  };

  const deleteImage = imageToDelete => {
    setMessages(prevMessages => {
      const updatedMessages = prevMessages.map(msg => {
        if (msg.image && msg.image.includes(imageToDelete)) {
          if (msg.image.length === 1) {
            return {...msg, isDeleted: true};
          }
          const updatedImages = msg.image.filter(img => img !== imageToDelete);
          const deletedImageMessage = {
            text: 'This image is deleted',
            isDeleted: true,
          };
          return [
            ...updatedImages.map(img => ({image: [img], text: msg.text})),
            deletedImageMessage,
          ];
        }
        return msg;
      });
      return updatedMessages.flat();
    });
  };  

  const handleVideoIconPress = () => {
    navigation.navigate('VideoCallHomePage');
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      {!isMessageLongPressed ? (
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back-outline" size={30} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleVideoIconPress}>
            <Ionicons name="videocam-outline" size={30} color="black" />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.header1}>
          <TouchableOpacity onPress={handleLongPressCloseButton}>
            <Ionicons name="close" size={30} color="black" />
          </TouchableOpacity>
          <View style={styles.rightIconsContainer}>
            <TouchableOpacity style={styles.iconButton}>
              <Entypo name="forward" color="black" size={25} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="trash-outline" size={25} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={pinIconfunction}
              style={styles.iconButton}>
              <AntDesign
                name={pinIcon ? 'pushpin' : 'pushpino'}
                size={25}
                color="black"
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <AntDesign name="infocirlceo" color="black" size={25} />
            </TouchableOpacity>
          </View>
        </View>
      )}
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        ref={scrollView => (this.scrollView = scrollView)}
        onContentSizeChange={() =>
          this.scrollView.scrollToEnd({animated: true})
        }>
        {messages.map((message, index) => (
          <View key={index} style={[styles.messageContainer, messageTextStyle]}>
            {message.documents &&
              message.documents.map((document, docIndex) => (
                <TouchableOpacity
                  key={docIndex}
                  style={styles.documentContainer}
                  onPress={() => openModal(document)}>
                  <FontAwesome name="file-text-o" size={20} color="white" />
                  <View style={styles.documentInfo}>
                    <Text style={styles.documentName}>{document.name}</Text>
                    <Text style={styles.documentSize}>
                      {formatFileSize(document.size)}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            {message.image &&
              Array.isArray(message.image) &&
              message.image.map((image, imgIndex) => (
                <View key={imgIndex}>
                  {!message.isDeleted ? (
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedImage(image);
                        setShowImageOverlay(true);
                      }}>
                      <Image
                        source={{uri: image}}
                        style={styles.image}
                        resizeMode="cover"
                      />
                    </TouchableOpacity>
                  ) : (
                    <Text style={{color: 'black', fontSize: 16}}>
                      This image is deleted
                    </Text>
                  )}
                </View>
              ))}
            {message.video && (
              <TouchableOpacity onPress={() => handleVideoPress(message.video)}>
                <Video
                  source={{uri: message.video}}
                  style={{width: 250, height: 250}}
                  muted={true}
                />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              key={message.id}
              onLongPress={() => handleLongPress(message.id)}
              onPress={() => handleIconPress(message.id)}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.messageText}>{message.text}</Text>
                <TouchableOpacity
                  onPress={() => handleIconPress(message.id)}
                  style={styles.correctionIcon}>
                  <AntDesign
                    name={
                      messageIconStates[message.id]
                        ? 'checkcircleo'
                        : 'checkcircle'
                    }
                    size={20}
                    color={messageIconStates[message.id] ? 'black' : '#1E90FF'}
                  />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </View>
        ))}
        {audioMessages.map((audioMessage, index) => (
          <View key={index} style={styles.audioPlaybackContainer}>
            <TouchableOpacity onPress={() => playRecording(index)}>
              <Ionicons
                name={
                  index === currentAudioIndex && isPlaying ? 'pause' : 'play'
                }
                size={30}
                color="#BFBFBF"
                style={styles.micplayicon}
              />
            </TouchableOpacity>
            <View style={styles.audioProgressContainer}>
              <Slider
                style={styles.audioSlider}
                value={audioRecorderPlayer.currentPosition}
                maximumValue={audioRecorderPlayer.duration}
                minimumValue={0}
                minimumTrackTintColor="gray" //#DCF8c5
                maximumTrackTintColor="grey" //#BFBFBF
                thumbTintColor="#BFBFBF"
              />
            </View>
            <View style={styles.secondLineContainer}>
              <Text style={styles.audioDurationText}>
                {formatDuration(
                  Math.round(audioMessage.stop - audioMessage.start),
                )}
              </Text>
            </View>
          </View>
        ))}
        {selectedDocuments.map((document, index) => (
          <TouchableOpacity
            key={index}
            style={styles.messageContainer}
            onPress={() => openModal(document)}>
            <View style={styles.documentContainer}>
              <FontAwesome name="file-text-o" size={20} color="black" />
              <View style={styles.documentInfo}>
                <Text style={styles.documentName} numberOfLines={1}>
                  {document.name.length > 20
                    ? document.name.substring(0, 15) + '...'
                    : document.name}
                </Text>
                <Text style={styles.documentSize}>
                  {formatFileSize(document.size)}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={false}
        visible={isModalVisibleVideo}
        onRequestClose={closeModal}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <TouchableOpacity
            style={{position: 'absolute', top: 20, left: 20}}
            onPress={closeModal}>
            <Ionicons name="arrow-back" size={30} color="black" />
          </TouchableOpacity>
          {fullScreenVideoUrl && (
            <View style={{width: width, height: 500}}>
              <Video
                source={{uri: fullScreenVideoUrl}}
                style={{width: '100%', height: '100%'}}
                resizeMode="contain"
                controls={false}
                paused={!isPlayingVideo}
                onTouchStart={playPauseToggleVideo}
              />
              {!isPlayingVideo && (
                <TouchableOpacity
                  onPress={playPauseToggleVideo}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: [{translateX: -15}, {translateY: -15}],
                  }}>
                  <Image
                    source={require('../Images/play.png')} 
                    style={{width: 50, height: 50}}
                  />
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </Modal>
      <Modal
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
        transparent={true}>
        <TouchableOpacity
          style={styles.modalContainer}
          onPress={() => setIsModalVisible(false)}>
          {renderDocumentContent()}
        </TouchableOpacity>
      </Modal>
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
                Gallery
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.imageplusicon}
              onPress={pickDocument}>
              <Ionicons
                name="document-outline"
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
                Document
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
      <View style={styles.inputContainer}>
        {!isKeyboardOpen && (
          <TouchableOpacity style={styles.cameraicon} onPress={usertextCamera}>
            <Ionicons name="camera" size={25} color="black" />
          </TouchableOpacity>
        )}
        <TextInput
          ref={textInputRef}
          style={styles.textInput}
          placeholder="Type your message..."
          value={inputText}
          onChangeText={setInputText}
        />
        {isKeyboardOpen ? (
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity onPress={plusBotton}>
              <Entypo
                name="plus"
                size={25}
                color="black"
                style={styles.sendiconbutton}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={sendMessage}
              style={styles.sendiconbutton}
              disabled={inputText.trim().length === 0}>
              <Entypo name="paper-plane" size={30} color="black" />
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <TouchableOpacity onPress={plusBotton}>
              <Entypo name="plus" size={25} color="black" style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={isRecording ? stopRecording : startRecording}>
              <Ionicons
                name={isRecording ? 'stop' : 'mic-outline'}
                size={25}
                color="black"
                style={styles.icon}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={userGalleryOpen}>
              <Ionicons
                name="image-outline"
                size={25}
                color="black"
                style={styles.icon}
              />
            </TouchableOpacity>
          </>
        )}
      </View>
      <Modal
        visible={showImagePreview}
        transparent={false}
        animationType="slide"
        onRequestClose={closeImagePreview}>
        <ImagePreviewScreen
          imageUrl={imageUrl}
          onClose={closeImagePreview}
          // onSendMessage={setInputText}
          navigation={navigation}
          // setImageUrl={setImageUrl}
          selectedVideo={selectedVideo}
        />
      </Modal>
      <Modal
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
        transparent={true}>
        <TouchableOpacity
          style={styles.modalContainer}
          onPress={() => setIsModalVisible(false)}>
          {renderDocumentContent()}
        </TouchableOpacity>
      </Modal>
      <Modal
        visible={showImageOverlay}
        transparent={true}
        onRequestClose={() => setShowImageOverlay(false)}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            source={{uri: selectedImage}}
            style={styles.fullWidthImage}
            resizeMode="contain"
          />
          <View
            style={{
              position: 'absolute',
              flexDirection: 'row',
              top: 10,
              width: '100%',
              paddingHorizontal: 10,
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity onPress={() => setShowImageOverlay(false)}>
              <Ionicons name="arrow-back-outline" size={30} color="black" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Entypo name="forward" color="black" size={30} />
            </TouchableOpacity>
          </View>
          {pinIconMessage && (
            <View style={styles.pinIConview}>
              <Text style={{color: 'white'}}>This Message is Pined</Text>
            </View>
          )}
          <View
            style={{
              flexDirection: 'row',
              position: 'absolute',
              bottom: 20,
              justifyContent: 'space-between',
              width: '80%',
              paddingHorizontal: 20,
            }}>
            <TouchableOpacity onPress={handleShare}>
              <Ionicons name="share-outline" size={30} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={pinIconfunction}>
              <AntDesign
                name={pinIcon ? 'pushpin' : 'pushpino'}
                size={25}
                color="black"
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteImage(selectedImage)}>
              <Ionicons name="trash-outline" size={25} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pinIConview: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 100,
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    paddingHorizontal: 20,
    backgroundColor: 'silver',
    height: 40,
    borderRadius: 20,
  },
  secondLineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginLeft: -70,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 60,
    backgroundColor: 'lightgray',
  },
  header1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 60,
    backgroundColor: 'lightgray',
  },
  contentContainer: {
    flexGrow: 1,
    backgroundColor: 'white',
  },
  messageContainer: {
    padding: 8,
    marginVertical: 4,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 0,
    backgroundColor: '#DCF8c5',
    maxWidth: '80%',
    alignSelf: 'flex-end',
    marginRight: 10,
    flexDirection: 'column',
  },
  image: {
    width: 250,
    height: 250,
    borderRadius: 8,
    marginTop: 8,
  },
  messageText: {
    fontSize: 16,
    color: 'black',
  },
  micplayicon: {
    color: 'gray',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'lightgray',
    padding: 10,
    backgroundColor: 'whitesmoke',
    width: width,
  },
  textInput: {
    height: 40,
    borderWidth: 1,
    width: '50%',
    borderColor: 'grey',
    borderRadius: 20,
    padding: 8,
    marginHorizontal: 5,
    color: 'black',
    // backgroundColor:"silver",
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
  iconButton: {
    marginRight: 30,
  },
  rightIconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sendiconbutton: {
    padding: 10,
    marginLeft: 15,
  },
  icon: {
    marginHorizontal: 5,
  },
  iconss: {
    padding: 10,
  },
  plusIcon: {
    marginRight: 15,
  },
  bottomboxone: {
    width: '90%',
    height: 300,
    borderRadius: 20,
    backgroundColor: '#BFBFBF',
    position: 'absolute',
    bottom: 150,
    left: '5%',
    right: '5%',
  },
  bottomboxtwo: {
    width: '90%',
    height: 60,
    borderRadius: 20,
    position: 'absolute',
    bottom: 80,
    left: '5%',
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
  audioPlaybackContainer: {
    backgroundColor: '#DCF8c5',
    borderRadius: 8,
    padding: 10,
    marginRight: 8,
    alignSelf: 'flex-end',
    marginBottom: 10,
    flexDirection: 'row',
  },
  audioSlider: {
    width: '60%',
    height: 20,
  },
  audioProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  audioProgressText: {
    color: '#BFBFBF',
    fontSize: 12,
  },
  fullWidthImage: {
    width: width,
    height: '60%',
    resizeMode: 'cover',
  },
  correctionIcon: {
    position: 'absolute',
    // top: 4,
    right: -38,
  },
});

export default GlobalChatScreen;
