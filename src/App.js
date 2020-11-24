import React from 'react';
import './App.css';

import Header from './components/Header'
import ToyForm from './components/ToyForm'
import ToyContainer from './components/ToyContainer'


class App extends React.Component{

  state = {
    display: false,
    toys: []
  }

  componentDidMount() {
    fetch('http://localhost:3001/toys')
    .then(resp => resp.json())
    .then(json => 
      this.setState({
        toys: json
      })
    )
  }

  handleClick = () => {
    let newBoolean = !this.state.display
    this.setState({
      display: newBoolean
    })
  }

  handleSubmit = (e, newToy) => {
    e.preventDefault()
    e.target.reset()

    fetch('http://localhost:3001/toys', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({...newToy, likes: 0})
    })
    .then(resp => resp.json())
    .then(json => 
      this.setState(prev => {
        return {
          toys: [...prev.toys, json]
        }
      })
    )
  }

  handleDelete = (id) => {
    fetch(`http://localhost:3001/toys/${id}`, {
      method: 'DELETE'
    })
    .then(resp => resp.json())
    .then(json => {
      console.log(`Deletion of ${id} was great success!`)
      
      const newToys = this.state.toys.filter(toy => {
        return toy.id !== id
      })

      this.setState({
        toys: newToys
      })

      }
    )
  }

  handleLike = (id, newLikes) => {
    fetch(`http://localhost:3001/toys/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({likes: newLikes + 1})
    })
    .then(resp => resp.json())
    .then(json => {

      const newToys = this.state.toys.map(toy => {
        return toy.id === id ? json : toy
      })

      this.setState({
        toys: newToys
      })

      }
    )
  }  

  render(){
    return (
      <>
        <Header/>
        { this.state.display
            ?
          <ToyForm handleSubmit={this.handleSubmit}/>
            :
          null
        }
        <div className="buttonContainer">
          <button onClick={this.handleClick}> Add a Toy </button>
        </div>
        <ToyContainer handleLike={this.handleLike} handleDelete={this.handleDelete} toys={this.state.toys}/>
      </>
    );
  }

}

export default App;
