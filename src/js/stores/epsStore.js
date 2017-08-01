import { createStore } from 'redux';
import { reducers } from '../reducers';

export const store = createStore(reducers, {
  EPS: {
    data: []
  },
  Token: {
    data: []
  },
  Modulo: {
    data: []
  }
})
