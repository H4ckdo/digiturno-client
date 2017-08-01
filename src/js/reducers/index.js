import { combineReducers } from 'redux';
import { EPS } from './epsReducer.js';
import { Token } from './tokenReducer.js';
import { Modulo } from './moduloReducer.js';

export const reducers = combineReducers({
  EPS,
  Token,
  Modulo
})

