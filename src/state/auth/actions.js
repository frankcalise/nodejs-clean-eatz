import firebase, { Auth } from "../../config/firebase";
import { encodeAsFirebaseKey } from "../../utils/firebaseUtils";
import * as types from "./types";

export const fetchUser = () => dispatch => {
  Auth.onAuthStateChanged(user => {
    const payload = user || null;
    dispatch({ type: types.FETCH_USER, payload });
  });
};

export const signIn = (email, password) => dispatch => {
  Auth.signInWithEmailAndPassword(email, password).then(
    payload => {
      // dispatch({ type: "LOGIN", payload });
      console.log(payload);
      dispatch(fetchUser());
    },
    error => {
      dispatch(setError(error.message));
    }
  );
};

export const signOut = () => dispatch => {
  Auth.signOut()
    .then(() => {
      // sign-out successful
      dispatch(fetchUser());
    })
    .catch(error => {
      console.log(error);
    });
};

export const registerUser = (email, password) => dispatch => {
  Auth.createUserWithEmailAndPassword(email, password).then(
    payload => {
      const { uid } = payload.user;
      // do firebase set uid in allowedUsers
      const emailKey = encodeAsFirebaseKey(email);
      firebase
        .database()
        .ref(`/allowedUsers`)
        .update({ [emailKey]: uid });
    },
    error => {
      dispatch(setError(error.message));
    }
  );
};

export const clearError = () => dispatch => {
  dispatch({ type: types.CLEAR_ERROR });
};

export const setError = payload => dispatch => {
  dispatch({ type: types.SET_ERROR, payload });
};
