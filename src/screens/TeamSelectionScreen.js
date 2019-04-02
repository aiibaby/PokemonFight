import React, { Component } from "react";
import { View, TouchableOpacity, Alert, ActivityIndicator } from "react-native";

import CustomText from "../components/CustomText";
import PokemonList from "../components/PokemonList";
import ActionList from "../components/ActionList";

import { connect } from "react-redux";
import { setTeam, setPokemon } from "../actions";
import moves_data from "../data/moves_data"
// todo: import helper functions

import uniqid from "../helpers/uniqid";
import shuffleArray from "../helpers/shuffleArray";

class TeamSelectionScreen extends Component {
  static navigationOptions = {
    header: null
  };

  state = {
    is_loading: false
  };

  render() {
    const { selected_pokemon } = this.props;
    return (
      <View style={styles.container}>
        <CustomText styles={[styles.headerText]}>Select your team</CustomText>

        {selected_pokemon.length == 6 && (
          <View>
            {this.state.is_loading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#ffbf5a" />
                <CustomText styles={styles.messageText}>
                  Waiting for opponent..
                </CustomText>
              </View>
            )}

            {!this.state.is_loading && (
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={this.confirmTeam}
              >
                <CustomText>Confirm Selection</CustomText>
              </TouchableOpacity>
            )}
          </View>
        )}
        <PokemonList
          data={this.props.pokemon}
          numColumns={1}
          action_type={"select-pokemon"}
        />
    </View>
    );
  }

  confirmTeam = () => {
    const { selected_pokemon, setTeam, setPokemon, navigation} = this.props;

    let team = selected_pokemon.slice(0); // the array which stores the data for the Pokemon team selected by the user
    team = team.map(item => {
      let hp = 500;
      let shuffled_moves = shuffleArray(item.moves);
      let selected_moves = shuffled_moves.slice(0, 4);

      let moves = moves_data.filter(item => {
        return selected_moves.indexOf(item.id) !== -1;
      });

      let member_id = uniqid();

      return {
        ...item,
        team_member_id: member_id, // unique ID for identifying each Pokemon in the team
        current_hp: hp, // current HP. This gets updated when an opponent Pokemon attacks
        total_hp: hp,
        moves: moves,
        is_selected: false // no longer needed
      };
    });
    // update the store with the new team and Pokemon data
    setTeam(team);
    setPokemon(team[0]);
    // next: set is_loading to true in state and navigate to Battle screen
    this.setState({
      is_loading: true // show activity indicator
    });

    setTimeout(() => {
      const username = navigation.getParam("username");

      this.setState({
        is_loading: false
      });

      navigation.navigate("Battle", {
        username: username
      });
    }, 2500); 
  };
}

const mapStateToProps = ({ team_selection }) => {
  const { pokemon, selected_pokemon } = team_selection;
  // return pokemon and selected_pokemon as props for this component
  return {
    pokemon, // all the Pokemon available for selection (a copy of src/data/pokemon_data.js)
    selected_pokemon // array of selected Pokemon
  };
}

const mapDispatchToProps = dispatch => {
  // for updating the value of team and pokemon in src/reducers/BattleReducer.js
  return {
    setTeam: team => {
      dispatch(setTeam(team));
    },
    setPokemon: pokemon => {
      dispatch(setPokemon(pokemon));
    }
  };
};


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TeamSelectionScreen);

const styles = {
  container: {
    flex: 1
  },
  headerText: {
    fontSize: 20,
    marginTop: 50,
    marginBottom: 10,
    alignSelf: "center"
  },
  confirmButton: {
    padding: 10,
    alignSelf: "center",
    marginBottom: 10,
    backgroundColor: "#95ff84"
  },
  loadingContainer: {
    alignItems: "center"
  },
  messageText: {
    fontSize: 13,
    color: "#676767"
  }
};