import React from 'react';
import './App.css';
import Container from './components/Container';
import Navigation from './components/Navigation';
import Signin from './components/Signin';
import Register from './components/Register';


const initialState = {
  input: '',
  route:'signin',
  isSignedIn: false,
  user:{
    id: '',
    name: '',
    email: '',
    joined: ''
  }
}

function App() {
  const [state, setState] = React.useState(initialState);

  const loadUser = (data) => {
    let {id, name, email, joined} = data;
    setState({
      ...state,
      user: {
        id: id,
        name: name,
        email: email,
        joined: joined
     },
    });
  }

  const onInputChange = (event) => {
    setState({...state, input: event.target.value});
  }

  const onButtonSubmit = () => {
    console.log(state.input);
    fetch('http://localhost:3000/imageurl', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        input: state.input
      })
    })
    .then(response => response.json())
    .then(response => {
      if(response){
        fetch('http://localhost:3000/image', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            id: state.user.id
          })
        })
        .then(response => response.json())
        .then(count => {
          this.setState(Object.assign(this.state.user, {entries: count}));
        })
        .catch(console.log);
      }
    })
    .catch(err => console.log(err));
  }

  const onRouteChange = (route) => {
    if (route === 'signin'){
      console.log(initialState);
      setState(initialState);
    } else if (route === 'home'){
      setState({...state, isSignedIn: true});
    }
    setState({...state, route: route});
  }
  const { isSignedIn, route} = state;
  return (
    
    <div className="App" >
      {/* <Navigation
          isSignedIn={isSignedIn}
          onRouteChange={onRouteChange}
        /> */}
        <div className = "container" >
          <Container/>
        </div>
      {/* {route === "home" ? (
        <div>
          <Container/>
        </div>
      ): route === "signin" ? (
        <Signin loadUser={loadUser} onRouteChange={onRouteChange} />
      ) : (
        <Register loadUser={loadUser}  onRouteChange={onRouteChange} />
        )} */}
    </div>
  );
}

export default App;
