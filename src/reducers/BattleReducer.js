import { TEAM_SET, CURRENT_POKEMON_SET, SET_OPPONENT_TEAM, SET_MOVE, SET_OPPONENT_POKEMON, SET_OPPONENT_POKEMON_HEALTH, REMOVE_POKEMON_FROM_OPPONENT_TEAM} from "../actions/types";

const move_display_text = {
    "select-move": "Select your move", // main menu (choose whether to attack or switch)
    "select-pokemon": "Which Pokemon will you use?", // choose another Pokemon from team
    "select-pokemon-move": "Which attack will you use?" // choose a move by their current Pokemon
  };

const default_move = "select-move";

const INITIAL_STATE = {
    team:[], // the user's Pokemon team
    pokemon: null, // currently selected pokemon by user (the one being shown in the UI)
    move: default_move,
    move_display_text: move_display_text[default_move],
    opponent_team: [],
    opponent_pokemon: null // currently selected pokemon by opponent 
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case TEAM_SET:
            const { team } = action;
            return { ...state, team };
        
        case CURRENT_POKEMON_SET:
            const pokemon = action.pokemon;
            return { ...state, pokemon};

        case SET_OPPONENT_TEAM: // for setting the opponent's team
            return { ...state, opponent_team: action.team };
      
        case SET_MOVE: // for setting the controls currently displayed in the user's screen
            const { move } = action; 
            return { ...state, move, move_display_text: move_display_text[move] };
    
        case SET_OPPONENT_POKEMON: // for setting the opponent's current Pokemon
            const opponent_pokemon = action.pokemon
                ? action.pokemon
                : state.opponent_team[0]; // if the action didn't pass a Pokemon, use the first Pokemon in the opponent's team instead
            return { ...state, opponent_pokemon };
    
        case SET_OPPONENT_POKEMON_HEALTH: // for updating the opponent's current Pokemon's health
            let opponent_team = [...state.opponent_team];
            opponent_team = opponent_team.map(item => {
                if (item.team_member_id == action.team_member_id) {
                item.current_hp = action.health;
                }
                return item;
            });
    
        return { ...state, opponent_team };
    
        case REMOVE_POKEMON_FROM_OPPONENT_TEAM: // for removing a specific Pokemon from opponent's team after it faints (when its HP goes below 1)
            const diminished_opponent_team = [...state.opponent_team].filter(item => {
                return item.team_member_id != action.team_member_id;
            });
            return { ...state, opponent_team: diminished_opponent_team };
        
        default:
            return state;
        
    }
}

