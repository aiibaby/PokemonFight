import { TEAM_SET, CURRENT_POKEMON_SET} from "../actions/types";

const INITIAL_STATE = {
    team:[], // the user's Pokemon team
    pokemon: null // currently selected pokemon by user (the one being shown in the UI)
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case TEAM_SET:
            const { team } = action;
            return { ...state, team };
        
        case CURRENT_POKEMON_SET:
            const pokemon = action.pokemon;
            return { ...state, pokemon};

        default:
            return state;
        
    }
}

