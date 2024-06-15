import LoginPages from './LoginPages';
import MainPages from './MainPages';
import Otpverification from './Otpverification';
import LoginCenter from './LoginCenter';
import Login from './Login';
import UserSetupPage from './UserSetupPage';
import ChatScreenPage from './ChatScreenPage';
import GlobalChatScreen from './GlobalChatScreen';
import DocumentViewer from './DocumentViewer';
import VideoCallScreen from './VideoCallScreen';
import VideoCallHomePage from "./VideoCallHomePage";
import {createStackNavigator} from '@react-navigation/stack';
import ImagePreviewScreen from './ImagePreviewScreen';
import {NavigationContainer} from '@react-navigation/native';
const Stack = createStackNavigator();

const Working = () => {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator>
        {/* <Stack.Screen
        name="LoginCenter"
        component={LoginCenter}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="LoginPages"
        component={LoginPages}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Otpverification"
        component={Otpverification}
        options={{headerShown: false}}
      /> */}
        <Stack.Screen
          name="MainPages"
          component={MainPages}
          options={{headerShown: false}}
        />
        {/* <Stack.Screen
          name="UserSetupPage"
          component={UserSetupPage}
          options={{headerShown: false}}
        /> */}
        <Stack.Screen
          name="ChatScreenPage"
          component={ChatScreenPage}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="GlobalChatScreen"
          component={GlobalChatScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ImagePreviewScreen"
          component={ImagePreviewScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="DocumentViewer"
          component={DocumentViewer}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="VideoCallScreen"
          component={VideoCallScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="VideoCallHomePage"
          component={VideoCallHomePage}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Working;
