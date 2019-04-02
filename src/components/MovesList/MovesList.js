import React from "react";
import { TouchableOpacity, FlatList } from "react-native";
import CustomText from "../CustomText";
import { connect } from "react-redux";
import {
  setOpponentPokemonHealth, // for setting the current opponent Pokemon's health
  removePokemonFromOpponentTeam, // for removing the current opponent Pokemon from the opponent team
  setOpponentPokemon, // for setting the current opponent Pokemon after the previous one has fainted
  setMove // for going back to the initial controls UI after the opponent Pokemon has fainted
} from "../../actions";
import getMoveEffectivenessAndDamage from "../../helpers/getMoveEffectivenessAndDamage";


const MovesList = ({
  moves,
  opponent_pokemon,
  setOpponentPokemonHealth,
  removePokemonFromOpponentTeam,
  setOpponentPokemon,
  setMove
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
            let { damage } = getMoveEffectivenessAndDamage(item, opponent_pokemon);
            let health = opponent_pokemon.current_hp - damage;
      
            setOpponentPokemonHealth(opponent_pokemon.team_member_id, health); // update the opponent Pokemon's health
      
            if (health < 1) { // opponent Pokemon has fainted
              removePokemonFromOpponentTeam(opponent_pokemon.team_member_id);
      
              setMove("select-move"); // go back to the initial controls UI
              setOpponentPokemon(); // set the opponent Pokemon (if there's still one left)
            }
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
  const { opponent_pokemon } = battle;

  return {
    opponent_pokemon
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
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MovesList);
