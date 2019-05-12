import React, { useState } from "react";
import firebase from "./Firebase";

const FirebaseContext = React.createContext([{}, () => {}]);

const FirebaseProvider = props => {
  const [state, setState] = useState({
    firebase: firebase.firebase
  });
  return (
    <FirebaseContext.Provider value={[state, setState]}>
      {props.children}
    </FirebaseContext.Provider>
  );
};

export { FirebaseContext, FirebaseProvider };
