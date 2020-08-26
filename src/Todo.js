import React, { useState } from "react";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import Checkbox from "@material-ui/core/Checkbox";
import Tooltip from "@material-ui/core/Tooltip";
import { makeStyles } from "@material-ui/core/styles";
import "./Todo.css";
import {
  List,
  ListItem,
  ListItemText,
  Button,
  Modal,
  FormControl,
  Input,
} from "@material-ui/core";
import db from "./firebase";

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();
  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    position: "absolute",
    width: 350,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  list: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: theme.palette.background.paper,
  },
}));

function Todo(props) {
  const classes = useStyles();
  const [input, setInput] = useState();
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const updateTodo = () => {
    //update todo with the new input text
    db.collection("todos").doc(props.todo.id).set(
      {
        todo: input,
      },
      { merge: true }
    );
    setOpen(false);
  };
  return (
    <>
      <Modal
        aria-labelledby="Edit Todo"
        aria-describedby="Edit your todo and hit enter to save changes"
        open={open}
        onClose={(e) => setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form>
            <FormControl>
              <h1>Edit todo...</h1>
              <div>
                <Input
                  value={input}
                  placeholder={props.todo.todo}
                  onChange={(event) => setInput(event.target.value)}
                />
                {/* allows the input to be updated when you type */}
                <Button
                  disabled={!input}
                  type="submit"
                  color="primary"
                  variant="contained"
                  onClick={updateTodo}
                  style={{ margin: "14px" }}
                >
                  Save changes
                </Button>
              </div>
            </FormControl>
          </form>
        </div>
      </Modal>
      <div className={classes.list}>
        <List>
          <ListItem button style={{ cursor: "default" }}>
            <ListItemText
              primary={props.todo.todo}
              secondary="Monday - 7:30 AM ⏰ "
            />
            {/* props.KEY.OBJECT, to clarify  */}
            <Tooltip title="Edit" arrow>
              <EditIcon
                style={{ cursor: "pointer" }}
                onClick={(e) => setOpen(true)}
              />
            </Tooltip>
            <Tooltip title="Delete" arrow>
              <DeleteIcon
                style={{ cursor: "pointer" }}
                onClick={(event) => {
                  db.collection("todos").doc(props.todo.id).delete();
                }}
              />
            </Tooltip>
          </ListItem>
        </List>
      </div>
    </>
  );
}

export default Todo;
