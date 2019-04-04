import React, { Component } from "react";
import { View, TouchableOpacity, Alert, Image } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import CustomText from "../components/CustomText";
import PokemonFullSprite from "../components/PokemonFullSprite";
import HealthBar from "../components/HealthBar";
import ActionList from "../components/ActionList";
import MovesList from "../components/MovesList";
import PokemonList from "../components/PokemonList";
import { connect } from "react-redux";
import pokemon_data from "../data/pokemon_data.js";
import moves_data from "../data/moves_data";
import uniqid from "../helpers/uniqid";
import randomInt from "../helpers/randomInt";
import shuffleArray from "../helpers/shuffleArray";
import { setOpponentTeam, setOpponentPokemon, setMove, setPokemonHealth, removePokemonFromTeam, setMessage, removePokemonFromOpponentTeam } from "../actions";


class BattleScreen extends Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.opponents_channel = null;
  }


  async componentDidMount() {
    const { setOpponentTeam, setOpponentPokemon, navigation,
    team, setMove, removePokemonFromOpponentTeam,
    setMessage, removePokemonFromTeam } = this.props;

    let pusher = navigation.getParam("pusher");
    const { username, pokemon_ids, team_member_ids } = navigation.getParam(
      "opponent"
    );

    let opponent_pokemon_ids = pokemon_ids.split(",");
    let opponent_team_member_ids = team_member_ids.split(",");
    // only return the data of the Pokemon's that are on the opponent's team
    let opponent_team_data = pokemon_data.filter(item => {
      return opponent_pokemon_ids.indexOf(item.id.toString()) !== -1;
    });

    opponent_team_data = opponent_team_data.map((item, index) => {
      let hp = 500;

      let shuffled_moves = shuffleArray(item.moves);
      let selected_moves = shuffled_moves.slice(0, 4);

      let moves = moves_data.filter(item => {
        return selected_moves.indexOf(item.id) !== -1;
      });

      return {
        ...item,
        current_hp: hp,
        total_hp: hp,
        moves: moves,
        is_selected: false
      };
    });

    let sorted_opponent_team = [];
    opponent_pokemon_ids.forEach((id, index) => {
      let team_member = opponent_team_data.find(
        item => id == item.id.toString()
      );
      team_member.team_member_id = opponent_team_member_ids[index];
      sorted_opponent_team.push(team_member);
    });

    // save the opponent Pokemon team in the store
    setOpponentTeam(sorted_opponent_team);
    setOpponentPokemon(sorted_opponent_team[0]);

    this.opponents_channel = pusher.subscribe(`private-user-${username}`);
    this.opponents_channel.bind("pusher:subscription_error", status => {
      Alert.alert(
        "Error",
        "Subscription error occurred. Please restart the app"
      );
    });

    this.opponents_channel.bind("pusher:subscription_succeeded", data => {
      const first_turn = navigation.getParam("first_turn");

      if (first_turn != "you") {
        setMessage("Please wait for you turn..."); // set message to display in place of the controls UI
        setMove("wait-for-turn");
      }
    });

    let my_channel = navigation.getParam("my_channel");

    my_channel.bind("client-switched-pokemon", ({ team_member_id }) => {
      let pokemon = sorted_opponent_team.find(item => {
        return item.team_member_id == team_member_id;
      });

      setMessage(`Opponent changed Pokemon to ${pokemon.label}`);
      setOpponentPokemon(pokemon);

      setTimeout(() => {
        setMove("select-move");
      }, 1500);
    });

    my_channel.bind("client-pokemon-attacked", data => {
      setMessage(data.message);

      // update the UI with the new health and allow user to make a move after 1.5 seconds
      setTimeout(() => {
        setPokemonHealth(data.team_member_id, data.health);
        setMove("select-move");
      }, 1500); 

      if (data.health < 1) { // if the Pokemon faints
        let fainted_pokemon = team.find(item => {
          return item.team_member_id == data.team_member_id;
        });

        setTimeout(() => {
          setPokemonHealth(data.team_member_id, 0); 

          setMessage(`${fainted_pokemon.label} fainted`);
          removePokemonFromTeam(data.team_member_id);

        }, 1000);

        // let the user select the Pokemon to switch to
        setTimeout(() => {
          setMove("select-pokemon");
        }, 2000);
      }
    });


    // let random_pokemon_ids = [];
    // for (let x = 0; x <= 5; x++) {
    //   random_pokemon_ids.push(randomInt(1, 54));
    // }

    // let opposing_team = pokemon_data.filter(item => {
    //   return random_pokemon_ids.indexOf(item.id) !== -1;
    // });

    // opposing_team = opposing_team.map(item => {
    //   let hp = 500;

    //   let shuffled_moves = shuffleArray(item.moves);
    //   let selected_moves = shuffled_moves.slice(0, 4);

    //   let moves = moves_data.filter(item => {
    //     return selected_moves.indexOf(item.id) !== -1;
    //   });

    //   let member_id = uniqid();

    //   return {
    //     ...item,
    //     team_member_id: member_id,
    //     current_hp: hp,
    //     total_hp: hp,
    //     moves: moves,
    //     is_selected: false
    //   };
    // });

    // // update the store with the opponent team and current opponent Pokemon
    // setOpponentTeam(opposing_team);
    // setOpponentPokemon(opposing_team[0]);

  
    // todo: get reference to Pusher connection from navigation param

    /*
    todo:
    - get opponent's Pokemon IDs and team member IDs from navigation param
    - construct the opponent team array based on the Pokemon IDs
    - sort the opponent team array based on the ordering of the team member IDs from the navigation param
    - add the team member ID to each Pokemon
    - dispatch action for setting the opponent Pokemon team and setting the current opponent Pokemon
    */

    /*
    todo:
    - determine if it's the user's turn, if not then dispatch an action to set them to wait for their turn
    */

    /*
    todo:
    - listen for event for when the opponent switched Pokemon
    - find the Pokemon from the opponent team array
    - dispatch action that will set the opponent Pokemon
    - dispatch action that will allow the current user to make a move
    */

    /*
    todo:
    - listen for event when the opponent Pokemon attacked the current user's Pokemon
    - dispatch action that will update the current Pokemon's health
    - if current Pokemon's health goes below 1, remove current Pokemon from team
    - emit event that will let the opponent know that their opponent's Pokemon has fainted
    - dispatch action that will allow the current user to pick a Pokemon to switch to
    */

    /*
    todo:
    - listen for event for when the opponent's Pokemon fainted
    - dispatch event that will remove the opponent's current Pokemon from the opposing team
    */
  }
  render() {
    const {
      team,
      move,
      move_display_text,
      pokemon,
      opponent_pokemon,
      backToMove,
      message
    } = this.props;

    return (
      <View style={styles.container}>
        <CustomText styles={[styles.headerText]}>Fight!</CustomText>
        {/* <Image 
          source={require('../assets/images/background/bg1.jpg')}
          style={{width: 100, height: 50}}
        ></Image> */}
        <View style={styles.battleGround}>
          {opponent_pokemon && (
            <View style={styles.opponent}>
              <HealthBar
                currentHealth={opponent_pokemon.current_hp}
                totalHealth={opponent_pokemon.total_hp}
                label={opponent_pokemon.label}
              />
              <PokemonFullSprite
                pokemon={opponent_pokemon.label}
                spriteFront={opponent_pokemon.front}
                spriteBack={opponent_pokemon.back}
                orientation={"front"}
              />
            </View>
          )}

          {pokemon && (
            <View style={styles.currentPlayer}>
              <HealthBar
                currentHealth={pokemon.current_hp}
                totalHealth={pokemon.total_hp}
                label={pokemon.label}/>

              <PokemonFullSprite
                pokemon={pokemon.label}
                spriteFront={pokemon.front}
                spriteBack={pokemon.back}
                orientation={"back"}/>
            </View>
          )}
        </View>

        <View style={styles.controls}>
          <View style={styles.controlsHeader}>
            {(move == "select-pokemon" || move == "select-pokemon-move") && (
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => {
                  backToMove();
                }}
              >
                <Ionicons name="md-arrow-round-back" size={20} color="#333" />
              </TouchableOpacity>
            )}

            {move != "wait-for-turn" && (
              <CustomText styles={styles.controlsHeaderText}>
                {move_display_text}
              </CustomText>
            )}

            {move == "wait-for-turn" && (
              <CustomText styles={styles.message}>{message}</CustomText>
            )}
          </View>

          {move == "select-move" && <ActionList />}

          {move == "select-pokemon" && this.opponents_channel && (
            <PokemonList
              data={team}
              scrollEnabled={false}
              numColumns={2}
              action_type={"switch-pokemon"}
              opponents_channel = {this.opponents_channel}
            />
          )}

          {pokemon && this.opponents_channel &&
            move == "select-pokemon-move" && (
              <MovesList moves={pokemon.moves} />
            )}
        </View>
      </View>
    );
  }
}

const mapStateToProps = ({ battle }) => {
  const {
    team,
    move,
    move_display_text,
    pokemon,
    opponent_team,
    opponent_pokemon,
    message
  } = battle;
  return {
    team,
    move,
    move_display_text,
    pokemon,
    opponent_team,
    opponent_pokemon,
    message
  };
};

const mapDispatchToProps = dispatch => {
  return {
    backToMove: () => {
      dispatch(setMove("select-move"));
    },
    setOpponentTeam: team => {
      dispatch(setOpponentTeam(team));
    },
    setOpponentPokemon: pokemon => {
      dispatch(setOpponentPokemon(pokemon));
    },
    setMessage: message => {
      dispatch(setMessage(message));
    },
    setPokemonHealth: (team_member_id, health) => {
      dispatch(setPokemonHealth(team_member_id, health));
    },
    setMove: move => {
      dispatch(setMove(move));
    },
    removePokemonFromTeam: team_member_id => {
      dispatch(removePokemonFromTeam(team_member_id));
    },
    removePokemonFromOpponentTeam: team_member_id => {
      dispatch(removePokemonFromOpponentTeam(team_member_id));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BattleScreen);

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  headerText: {
    fontSize: 20,
    marginTop: 50,
    marginBottom: 10,
    alignSelf: "center"
  },
  battleGround: {
    flex: 8,
    padding: 12,
    flexDirection: "column"
  },
  currentPlayer: {
    alignSelf: "flex-start",
    alignItems: "center"
  },
  opponent: {
    alignSelf: "flex-end",
    alignItems: "center"
  },
  controls: {
    flex: 3,
    backgroundColor: "#e6e6e6",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#404040"
  },
  controlsHeader: {
    alignSelf: "flex-start",
    flexDirection: "row",
    marginBottom: 10
  },
  backButton: {
    paddingLeft: 5,
    paddingRight: 5
  },
  controlsHeaderText: {
    paddingTop: 5
  },
  message: {
    fontSize: 15
  }
};
