import React, { useState } from 'react';
import './style.css';

export default function App() {
  const states = {
    empty: 'empty',
    isLoading: 'loading',
    hasLoaded: 'loaded',
    hasError: 'error'
  };

  const [currentState, setCurrentState] = useState(states.empty);
  const [imageSrc, setImageSrc] = useState(null);

  const transitions = {
    [states.empty]: {
      FETCH_IMG: states.isLoading
    },
    [states.isLoading]: {
      FETCH_IMG_SUCCESS: states.hasLoaded,
      FETCH_IMG_SUCCESS: states.hasError
    },
    [states.hasLoaded]: {
      FETCH_IMG: states.isLoading
    },
    [states.hasError]: {
      FETCH_IMG: states.isLoading
    }
  };

  function transition(currentState, action) {
    const nextState = transitions[currentState][action];
    return nextState || currentState;
  }

  function updateState(action) {
    setCurrentState(currentState => transition(currentState, action));
  }

  const compareState = state => {
    return currentState === state;
  };

  const getRandomId = () => {
    return Math.floor(Math.random() * 34);
  };

  const fetchCharacterImage = () => {
    updateState('FETCH_IMG');

    fetch(`https://rickandmortyapi.com/api/character/${getRandomId()}`)
      .then(res => {
        return res.json();
      })
      .then(({ image }) => {
        setImageSrc(image);
        updateState('FETCH_IMG_SUCCESS');
        console.log(currentState);
      })
      .catch(() => {
        updateState('FETCH_IMG_ERROR');
      });
  };

  return (
    <div>
      {compareState(states.isLoading) && <div>loading</div>}
      {!compareState(states.hasLoaded) && <img src={imageSrc} alt="" />}

      <button onClick={() => fetchCharacterImage()}>click</button>
    </div>
  );
}
