import request from './requestMiddleware';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

export default [  request, thunk, logger ];