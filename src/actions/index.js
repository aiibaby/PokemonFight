import { SELECTED_POKEMON_MARK, CURRENT_POKEMON_SET, TEAM_SET, SET_OPPONENT_TEAM, SET_MOVE, SET_OPPONENT_POKEMON, SET_OPPONENT_POKEMON_HEALTH, REMOVE_POKEMON_FROM_OPPONENT_TEAM, SET_POKEMON_HEALTH, SET_MESSAGE, REMOVE_POKEMON_FROM_TEAM} from "./types";

export const selectPokemon = (id, pokemon_data, is_selected) => { // accepts the Pokemon ID, Pokemon object, and a boolean representing whether it's selected or not
    return {
    type: SELECTED_POKEMON_MARK,
    id,
    pokemon_data,
    is_selected
    };
};

export const setPokemon = pokemon => { // accepts a single Pokemon object
    return {
        type: CURRENT_POKEMON_SET,
        pokemon
    };
};

export const setTeam = team => { // accepts a single Pokemon object
    return {
        type: TEAM_SET,
        team
    };
};

export const setOpponentTeam = team => { // accepts an array that contains the Pokemon data of the team selected by the user
    return {
      type: SET_OPPONENT_TEAM,
      team 
    };
  };

export const setMove = move => { // accepts an object containing the move data (same as what you see in src/data/moves_data.js)
  return {
    type: SET_MOVE,
    move
  };
};

export const setOpponentPokemon = pokemon => { // accepts an object containing the data of the Pokemon selected by the opponent
  return {
    type: SET_OPPONENT_POKEMON,
    pokemon
  };
};

export const setOpponentPokemonHealth = (team_member_id, health) => { // accepts the team_member_id of the opponent's Pokemon, and the new health points to be assigned
  return {
    type: SET_OPPONENT_POKEMON_HEALTH,
    team_member_id,
    health
  };
};

export const removePokemonFromOpponentTeam = team_member_id => { // accepts the team_member_id of the Pokemon to be removed from the opponent's team
  return {
    type: REMOVE_POKEMON_FROM_OPPONENT_TEAM,
    team_member_id
  };
};

export const setPokemonHealth = (team_member_id, health) => {
  return {
    type: SET_POKEMON_HEALTH,
    team_member_id,
    health
  }
}

export const setMessage = (message) => {
  return {
    type: SET_MESSAGE,
    message,
  }
}

export const removePokemonFromTeam = (team_member_id) => {
  return {
    type: REMOVE_POKEMON_FROM_TEAM,
    team_member_id
  }
}
