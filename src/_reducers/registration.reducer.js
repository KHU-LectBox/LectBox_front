import {
    REGISTER_USER
} from '../_actions/types'

export function registration(state = {}, action) {
    switch (action.type) {
        case REGISTER_USER:
            return {...state, registerSuccess: action.payload}
            
            
        default: 
            return state;  
    }
}