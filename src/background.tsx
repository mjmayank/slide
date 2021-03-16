import { wrapStore } from 'webext-redux';
import { applyMiddleware, createStore } from 'redux';
import ReduxThunk from 'redux-thunk';
import reducers from './background_reducers';
import {
  STORE_NAME,
} from './constants';

console.log( 'Background.html starting!' );
/*Put page action icon on all tabs*/

const store = createStore(reducers, applyMiddleware(ReduxThunk)); // a normal Redux store
wrapStore(store, { portName: STORE_NAME }); // make sure portName matches

console.log( 'Background.html done.' );
