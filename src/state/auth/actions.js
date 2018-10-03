import firebase, { Auth } from "../../config/firebase";
import {
  encodeAsFirebaseKey,
  decodeFirebaseKey
} from "../../utils/firebaseUtils";
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

export const fetchAllowedUsers = () => {
  return dispatch => {
    return firebase
      .database()
      .ref("allowedUsers")
      .orderByKey()
      .once("value")
      .then(snapshot => {
        const items = snapshot.val();
        const allowedUsers = Object.keys(items).map(x => {
          const value = items[x];
          const key = decodeFirebaseKey(x);
          return { email: key, uid: value };
        });

        return allowedUsers;
      })
      .then(allowedUsers => {
        dispatch({ type: types.FETCH_ALLOWED_USERS, allowedUsers });
      })
      .catch(err => {
        dispatch({ type: types.SET_ERROR, payload: err });
        console.log(err);
        return err;
      });
  };
};
