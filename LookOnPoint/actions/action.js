// We speciify the name of the action as a variable
const ADD_TO_COUNTER = 'ADD_TO_COUNTER'

// This is an action creator, it simply specifies the action.
// this is what we call to send an action.
export function addToCounter() {
  return {
    type: ADD_TO_COUNTER
  }
}