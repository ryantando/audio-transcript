import {
    SET_AUDIO_SPEED, SET_FORWARD, SET_REWIND, CLEAR_FORWARD_REWIND
} from './types';
  
export const setAudioSpeed = value => {
    return {
        type: SET_AUDIO_SPEED,
        payload: value
    }
}

export const setForward = () => {
    return {
        type: SET_FORWARD
    }
}

export const setRewind = () => {
    return {
        type: SET_REWIND
    }
}

export const clearForwardRewind = () => {
    return {
        type: CLEAR_FORWARD_REWIND
    }
}