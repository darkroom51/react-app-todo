import firebase from 'firebase'


// Initialize Firebase
var config = {
    apiKey: "AIzaSyC9rNjYNGBElQ_NYTvRdy_1teXASb3Lb4k",
    authDomain: "wld-react-app-todo.firebaseapp.com",
    databaseURL: "https://wld-react-app-todo.firebaseio.com",
    projectId: "wld-react-app-todo",
    storageBucket: "wld-react-app-todo.appspot.com",
    messagingSenderId: "233461056106"
};
firebase.initializeApp(config);

export const database = firebase.database();
// export const auth = firebase.auth();
// export const googleProvider = new firebase.auth.GoogleAuthProvider();