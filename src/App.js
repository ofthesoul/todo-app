import React, { useState, useEffect } from "react";
import { Button, FormControl, Input, InputLabel } from "@material-ui/core";
import db from "./firebase";
import Todo from "./Todo.js";
import "./App.css";
import firebase from "firebase";
//running 'JSX' aka dynamic javascript in the html with {}
//'state' is shortterm memory for the app component aka function
function App() {
  const [input, setInput] = useState("");
  const [todos, setTodos] = useState([]);

  //when the app loads we need to listen to the db and fetch new todos as theyre added/removed
  useEffect(() => {
    //this code fires when app.js loads
    db.collection("todos")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setTodos(
          snapshot.docs.map((doc) => ({ id: doc.id, todo: doc.data().todo }))
        ); //whenever anything changes in db it will return array of strings
      });
  }, []); //with nothing in this array, it runs when app.js loads and thats its not watching for a change.
  const addTodo = (event) => {
    //this will fire off when we click the button
    event.preventDefault(); //prevents automatic refreshing when typing input
    db.collection("todos").add({
      todo: input,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setInput(""); //resets input back after hitting enter
  };
  return (
    <div className="App">
      <h1>ToDo ✅</h1>
      <form>
        <FormControl>
          <InputLabel>Write a ToDo...</InputLabel>
          <Input
            value={input}
            onChange={(event) => setInput(event.target.value)}
          />
        </FormControl>
        <Button
          disabled={!input}
          type="submit"
          variant="contained"
          color="primary"
          onClick={addTodo}
        >
          Add ToDo
        </Button>
      </form>
      <ul>
        {todos.map((todo) => (
          //this returns first singular todo from todos array and pops it into the li
          <Todo todo={todo} />
          //<li>{todo}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
//2:30:17
