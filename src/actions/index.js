import { SELECTED_POKEMON_MARK, CURRENT_POKEMON_SET, TEAM_SET } from "./types";

export const selectPokemon = (id, pokemon_data, is_selected) => { // accepts the Pokemon ID, Pokemon object, and a boolean representing whether it's selected or not
    return {
    type: SELECTED_POKEMON_MARK,
    id,
    pokemon_data,
    is_selected
    };
};

export const currentPokemonSet = pokemon => { // accepts a single Pokemon object
    return {
        type: CURRENT_POKEMON_SET,
        pokemon
    };
};

export const teamSet = team => { // accepts a single Pokemon object
    return {
        type: TEAM_SET,
        team
    };
};