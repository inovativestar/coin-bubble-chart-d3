export default function requestMiddleware() {
  return next => action => {
    const { request, type, retryAction, ...rest } = action;

    if (!request) return next(action);

    const REQUEST = type;
    const SUCCESS = type + '_SUCCESS';
    const FAILURE = type + '_FAILURE';

    const UNAUTHORIZED = 'AUTH_UNAUTHORIZED';
    let storage = window.localStorage;
    const token = storage.getItem('token');
    next({ ...rest, type: REQUEST, isLoading: true });
      const defaults = {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': (token)? token : '' 
        }
      }      

      return fetch(request.url, {...defaults, ...request })
      .then(res => {
        if (res.status === 204) {
          next({ ...rest, type: SUCCESS, isLoading: false });
        } else if (res.ok) {
          return res.json().then(data => next({ ...rest, data, type: SUCCESS, isLoading: false }));
        } else if (res.status === 401) {
          next({ ...rest, type: FAILURE, lastAction: action, isLoading: false });          
          next({ ...rest, type: UNAUTHORIZED, lastAction: action });
        } else {  
          next({ ...rest, type: FAILURE, lastAction: action, isLoading: false });
        }
      })
      .catch(error => {
        next({ ...rest, error, type: FAILURE });
        return false;
      });


  };
}
