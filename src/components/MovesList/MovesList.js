import React from "react";
import { TouchableOpacity, FlatList } from "react-native";
import CustomText from "../CustomText";
import { connect } from "react-redux";
import {
  setOpponentPokemonHealth, // for setting the current opponent Pokemon's health
  removePokemonFromOpponentTeam, // for removing the current opponent Pokemon from the opponent team
  setOpponentPokemon, // for setting the current opponent Pokemon after the previous one has fainted
  setMove, // for going back to the initial controls UI after the opponent Pokemon has fainted
  setMessage
} from "../../actions";
import getMoveEffectivenessAndDamage from "../../helpers/getMoveEffectivenessAndDamage";


const MovesList = ({
  moves,
  opponent_pokemon,
  setOpponentPokemonHealth,
  removePokemonFromOpponentTeam,
  setOpponentPokemon,
  setMove,
  pokemon,
  opponent_channel,
  backtoMove,
  setMessage
}) => {
  return (
    <FlatList
      data={moves}
      numColumns={2}
      scrollEnabled={false}
      keyExtractor={(item, index) => item.id.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.container}
          onPress={() => {
            let { damage, effectiveness } = getMoveEffectivenessAndDamage(item, opponent_pokemon);
            let health = opponent_pokemon.current_hp - damage;

            let message = `${pokemon.label} used ${item.title}! ${effectiveness}`;

            setMessage(message)

            opponents_channel.trigger("client-pokemon-attacked", {
              team_member_id: opponent_pokemon.team_member_id,
              message: message,
              health: health
            });
      
            setOpponentPokemonHealth(opponent_pokemon.team_member_id, health); // update the opponent Pokemon's health
      
            if (health < 1) { // opponent Pokemon has fainted
              setOpponentPokemonHealth(opponent_pokemon.team_member_id, 0); // set health to zero so health bar is not all red
              removePokemonFromOpponentTeam(opponent_pokemon.team_member_id);
            }
            setTimeout(() => {
              setMessage("Please wait for your turn...");
              setMove("wait-for-turn");
            }, 1500);

          }}>
          <CustomText styles={styles.label}>{item.title}</CustomText>
        </TouchableOpacity>
      )}
    />
  );
};

const styles = {
  container: {
    width: 130,
    marginLeft: 5,
    marginRight: 5,
    alignItems: "center",
    padding: 5,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: "#ffd43b",
    marginBottom: 10
  },
  label: {
    fontSize: 14
  }
};

const mapStateToProps = ({ battle }) => {
  const { opponent_pokemon, pokemon} = battle;

  return {
    opponent_pokemon,
    pokemon
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setOpponentPokemonHealth: (team_member_id, health) => {
      dispatch(setOpponentPokemonHealth(team_member_id, health));
    },

    removePokemonFromOpponentTeam: team_member_id => {
      dispatch(removePokemonFromOpponentTeam(team_member_id));
    },

    setOpponentPokemon: () => {
      dispatch(setOpponentPokemon());
    },
    setMove: move => {
      dispatch(setMove(move));
    },
    backtoMove: () => {
      dispatch(setMove("select-move"));
    },
    setMessage: message => {
      dispatch(setMessage(message));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MovesList);
