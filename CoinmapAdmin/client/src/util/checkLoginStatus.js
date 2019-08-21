import _ from 'lodash';

const checkLoginStatus = () => {
  let storage = window.localStorage;
  const token = storage.getItem('token');
  if(token && token != '')
    return true;
  else
    return false;
};

export default checkLoginStatus;