import React from 'react';
import FireBase from "./firebase";
import './App.css';


function App() {
  const user = new FireBase().getUsers();
  console.log(user);
  return (
    <div>
      Hello
    </div>
  );
}

export default App;
