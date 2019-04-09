
import { View } from "react-native";
import React, { Component } from "react";
import { createStackNavigator, createAppContainer} from "react-navigation";

import LoginScreen from "./screens/LoginScreen";
import BattleScreen from "./screens/BattleScreen";
import TeamSelectionScreen from "./screens/TeamSelectionScreen";

import { Provider } from "react-redux";
import { createStore } from "redux";
import reducers from "./reducers";

import Reactotron from "reactotron-react-native";
import { reactotronRedux } from "reactotron-redux";

Reactotron.configure({ host: "YOUR_INTERNAL_IP_ADDRESS" }) // example: 192.168.254.108
  .useReactNative()
  .use(reactotronRedux())
  .connect();

const store = createStore(reducers);


console.ignoredYellowBox = ["Setting a timer"];

const RootStack = createStackNavigator(
  {
    Login: LoginScreen,
    TeamSelect: TeamSelectionScreen,
    Battle: BattleScreen
  },
  {
    initialRouteName: "Login"
  }
);


export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Provider store={store}>
          <RootStack />
        </Provider>
      </View>
    );
  }
}


const styles = {
  container: {
    flex: 1
  }
};
