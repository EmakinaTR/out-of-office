import app from 'firebase'
import 'firebase/auth'
import 'firebase/database'
const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
}

export default class Firebase {
    constructor() {
        app.initializeApp(config);
        this.auth = app.auth();
        this.db = app.database();
    }

    async getUsers() {
        const users = [];
 
        await app.firestore().collection('users').get()
            .then(querySnapshot => {
                querySnapshot.docs.forEach(doc => {
                    users.push(doc.data());
                });
            })
        return users;
    }
}