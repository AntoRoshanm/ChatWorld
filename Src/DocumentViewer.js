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
  Modal,
  Share,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import ImagePicker from 'react-native-image-crop-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const {height, width} = Dimensions.get('window');

const DocumentViewer = ({document, onClose, navigation}) => {
  const renderDocumentContent = () => {
    if (document && document.uri) {
      if (document.type && document.type.startsWith('image/')) {
        // Displaying an image
        return (
          <View>
            <Image source={{uri: document.uri}} style={styles.modalImage} />
          </View>
        );
      } else {
        // Handling other types of documents
        return (
          <View>
            <FontAwesome name="file-text-o" size={40} color="black" />
            <Text style={styles.documentName}>{document.name}</Text>
            {/* Add other details you want to display for non-image documents */}
          </View>
        );
      }
    } else {
      return <Text>No document content available</Text>;
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: 'ChatWorld',
        url: document.uri, 
        title: 'Document Sharing',
      });
    } catch (error) {
      console.error('Error sharing document:', error.message);
    }
  };

  return (
    <Modal visible={true} transparent={false} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <Ionicons name="arrow-back-outline" size={30} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareButton} onPress={handleShare} >
            <Ionicons name="share-outline" size={30} color="black" />
          </TouchableOpacity>
        </View>
        <View style={styles.images}>{renderDocumentContent()}</View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    width:width,
    height:height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    position: 'absolute',
    top: 20,
    zIndex: 1,
  },
  backButton: {
    marginRight: 20,
  },
  shareButton: {
    marginLeft: 20,
  },
  modalImage: {
    width: width,
    height: 300,
    borderRadius: 8,
    marginTop: 8,
  },
  documentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  documentName: {
    fontSize: 16,
    color: 'black',
  },
});

export default DocumentViewer;
