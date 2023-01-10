import React from 'react';

const initialState = {
  notifications: [],
};
const reducer = (state, action) => {
  switch (action.type) {
    case 'add-notification':
      return {
        ...state,
        notifications: [
          {...action.payload, id: Date.now()},
          ...state.notifications,
        ],
      };
    case 'delete-notification':
      return {
        ...state,
        notifications: state.notifications.filter(
          i => i.id !== action.payload.id,
        ),
      };

    default:
      return state;
  }
};
export const NotificationsContext = React.createContext({
  state: initialState,
  dispatch: () => null,
});

export const NotificationsProvider = ({children}) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  return (
    <NotificationsContext.Provider value={[state, dispatch]}>
      {children}
    </NotificationsContext.Provider>
  );
};
