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
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {RTCView, mediaDevices} from 'react-native-webrtc';
import io from 'socket.io-client';

const {height, width} = Dimensions.get('window');

const VideoCallScreen = ({navigation}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [videoICon, setVideoICon] = useState(true);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [mutedicons, setMutedicons] = useState(false);

  const MuteIcon = () => {
    setIsMuted(!isMuted);
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !isMuted;
      });
    }
    setMutedicons(!mutedicons);
  };

  const toggleVideoStream = () => {
    setVideoICon(!videoICon);
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = !videoICon;
      });
    }
  };

  useEffect(() => {
    const setupLocalStream = async () => {
      const stream = await mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
    };
    setupLocalStream();
    return () => {
      if (localStream) {
        localStream.getTracks().forEach((track) => {
          track.stop();
        });
      }
    };
  }, []);

  const setRemoteStreamHandler = (stream) => {
    setRemoteStream(stream);
  };

  const handleEndCall = () => {
    navigation.goBack();
  };

  const switchCamera = async () => {
    localStream.getTracks().forEach((track) => {
      track.stop();
    });
    const newStream = await mediaDevices.getUserMedia({
      video: { facingMode: videoICon ? 'environment' : 'user' },
      audio: true,
    });
    setLocalStream(newStream);
  };

  return (
    <View style={styles.container}>
      <View style={styles.videoCallScreen}>
        {remoteStream ? (
          <RTCView
            streamURL={remoteStream.toURL()}
            style={styles.videoCallScreen}
          />
        ) : (
          <View style={styles.videoCallScreen1}>
            {localStream && !videoICon && (
              <RTCView
                streamURL={localStream.toURL()}
                style={styles.videoCallScreen}
              />
            )}
          </View>
        )}
      </View>
      <View>
        {videoICon && localStream && (
          <View style={styles.userViewerContainer}>
            <RTCView
              streamURL={localStream.toURL()}
              style={styles.userViewer}
            />
            {mutedicons && (
              <View style={styles.videoIconContainer}>
                <FontAwesome6
                  name="microphone-slash"
                  size={30}
                  color="red"
                  style={styles.videoIcon}
                />
              </View>
            )}
          </View>
        )}
        {!videoICon && (
          <View style={styles.userView}>
            {mutedicons && (
              <View style={styles.mutedIconsContainer}>
                <FontAwesome6
                  name="microphone-slash"
                  size={25}
                  color="white"
                  style={styles.mutedIcon}
                />
              </View>
            )}
            <Ionicons
              name="videocam-off"
              size={30}
              color="white"
              style={styles.videocameraIcon}
            />
            <Text style={styles.videoOffText}>Video Off</Text>
          </View>
        )}
      </View>
      <View style={styles.bottomView}>
        <TouchableOpacity style={styles.camerarotateICon} onPress={switchCamera}>
          <FontAwesome6 name="camera-rotate" size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={toggleVideoStream}
          style={styles.camerarotateICon}>
          <Ionicons
            name={videoICon ? 'videocam' : 'videocam-off'}
            size={30}
            color="white"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={MuteIcon} style={styles.camerarotateICon}>
          <FontAwesome6
            name={isMuted ? 'microphone-slash' : 'microphone'}
            size={30}
            color="white"
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.CallendICon} onPress={handleEndCall}>
          <MaterialIcons name="call-end" size={30} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
  },
  videoCallScreen: {
    width: width,
    height: height,
  },
  mutedIconsContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:"center",
    backgroundColor:"silver",
    width:50,
    height:50,
    borderRadius:40,
  },
  userViewer: {
    width: 200,
    backgroundColor: 'black',
    height: 230,
    borderRadius: 20,
    position: 'absolute',
    bottom: 170,
    right: '5%',
  },
  videoCallScreen1: {
    width: width,
    height: height,
    backgroundColor: 'black',
  },
  bottomView: {
    width: '90%',
    height: 100,
    backgroundColor: 'grey',
    position: 'absolute',
    bottom: 50,
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
    left: '5%',
    right: '5%',
    marginHorizontal: 'auto',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  camerarotateICon: {
    backgroundColor: 'silver',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  CallendICon: {
    backgroundColor: 'red',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userView: {
    width: 200,
    backgroundColor: 'black',
    height: 230,
    borderRadius: 20,
    position: 'absolute',
    bottom: 170,
    right: '5%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoOffText: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
  },
  videocameraIcon: {
    marginRight: 10,
  },
  userViewerContainer: {
    position: 'relative',
  },
  videoIconContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  videoIcon: {
    marginRight: 5,
  },
  
});

export default VideoCallScreen;
