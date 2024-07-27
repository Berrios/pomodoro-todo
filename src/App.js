import React, { useState, useEffect } from 'react';
import { Container, AppBar, Typography, List, ListItem, ListItemText, Button, TextField, Grid, IconButton, Snackbar } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { initialTodoList } from './todoList'; // Import the initial todo list

const App = () => {
  const [time, setTime] = useState(1500); // 25 minutes in seconds
  const [timerOn, setTimerOn] = useState(false);
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : initialTodoList;
  });
  const [newTodo, setNewTodo] = useState({ week: '', day: '', topic: '', details: '' });
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // useEffect(() => {
  //   let interval = null;
  //   if (timerOn) {
  //     interval = setInterval(() => {
  //       setTime(prevTime => (prevTime === 0 ? 0 : prevTime - 1));
  //     }, 1000);
  //   } else if (!timerOn && time !== 0) {
  //     clearInterval(interval);
  //   }
  //   return () => clearInterval(interval);
  // }, [timerOn, time]);

  useEffect(() => {
    let interval = null;
    if (timerOn) {
      interval = setInterval(() => {
        setTime(prevTime => (prevTime === 0 ? 0 : prevTime - 1));
      }, 1000);
    } else if (!timerOn && time === 0) {
      clearInterval(interval);
      // Trigger an alert when the timer reaches zero
      setTimeout(() => {
        alert('Time is up!'); // You can customize the message here
      }, 1000); // Adjust the delay (in milliseconds) as needed
    }
    return () => clearInterval(interval);
  }, [timerOn, time]);

  const formatTime = time => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const sortTodos = (a, b) => {
    if (parseInt(a.week) !== parseInt(b.week)) {
      return parseInt(a.week) - parseInt(b.week);
    }
    return parseInt(a.day) - parseInt(b.day);
  };

  const addTodo = () => {
    const updatedTodos = [...todos, newTodo].sort(sortTodos);
    setTodos(updatedTodos);
    setNewTodo({ week: '', day: '', topic: '', details: '' });
    localStorage.setItem('todos', JSON.stringify(updatedTodos));
  };

  const removeTodo = index => {
    const updatedTodos = todos.filter((_, i) => i !== index).sort(sortTodos);
    setTodos(updatedTodos);
    localStorage.setItem('todos', JSON.stringify(updatedTodos));
  };

  const resetTodos = () => {
    setTodos(initialTodoList);
    localStorage.setItem('todos', JSON.stringify(initialTodoList));
  };

  const exportTodos = () => {
    const todoListString = `export const initialTodoList = ${JSON.stringify(todos, null, 2)};`;
    navigator.clipboard.writeText(todoListString).then(() => {
      setSnackbarOpen(true);
    });
  };

  return (
    <Container>
      <AppBar position="static" style={{ marginBottom: '1rem' }}>
        <Typography variant="h6" style={{ padding: '1rem' }}>
          Pomodoro Timer with To-Do List
        </Typography>
      </AppBar>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="h5">Pomodoro Timer</Typography>
          <Typography variant="h3">{formatTime(time)}</Typography>
          <Button variant="contained" color="primary" onClick={() => setTimerOn(!timerOn)}>
            {timerOn ? 'Stop' : 'Start'}
          </Button>
          <Button variant="contained" color="secondary" onClick={() => setTime(1500)} style={{ marginLeft: '1rem' }}>
            Reset
          </Button>
          <br /> 
          <br />
          <Typography variant="h5">Add To-Do</Typography>
          <TextField
            label="Week"
            value={newTodo.week}
            onChange={(e) => setNewTodo({ ...newTodo, week: e.target.value })}
            fullWidth
            style={{ marginBottom: '0.5rem' }}
          />
          <TextField
            label="Day"
            value={newTodo.day}
            onChange={(e) => setNewTodo({ ...newTodo, day: e.target.value })}
            fullWidth
            style={{ marginBottom: '0.5rem' }}
          />
          <TextField
            label="Topic"
            value={newTodo.topic}
            onChange={(e) => setNewTodo({ ...newTodo, topic: e.target.value })}
            fullWidth
            style={{ marginBottom: '0.5rem' }}
          />
          <TextField
            label="Details"
            value={newTodo.details}
            onChange={(e) => setNewTodo({ ...newTodo, details: e.target.value })}
            fullWidth
            style={{ marginBottom: '0.5rem' }}
          />
          <Button variant="contained" color="primary" onClick={addTodo}>
            Add To-Do
          </Button>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h5">To-Do List</Typography>
          <Button variant="contained" color="secondary" onClick={resetTodos} style={{ marginBottom: '1rem', marginRight: '1rem' }}>
            Reset to Initial List
          </Button>
          <Button variant="contained" color="primary" onClick={exportTodos} style={{ marginBottom: '1rem' }}>
            Export Todo List
          </Button>
          <List>
            {todos.map((todo, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={`Week ${todo.week}, Day ${todo.day}: ${todo.topic}`}
                  secondary={todo.details}
                />
                <IconButton edge="end" aria-label="delete" onClick={() => removeTodo(index)}>
                  <DeleteIcon />
                </IconButton>
              </ListItem>
            ))}
          </List>
        </Grid>
      </Grid>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message="Todo list exported to clipboard"
      />
    </Container>
  );
};

export default App;
