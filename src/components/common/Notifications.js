import {NotificationsContext} from '../../contexts/notifications';
import {useContext, useEffect} from 'react';
import {View, Text} from 'react-native';
import {Snackbar} from 'react-native-paper';

const Message = props => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      props.dispatch({
        type: 'delete-notification',
        payload: {
          id: props.id,
        },
      });
    }, 5000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);
  const onDismissSnackBar = () => {
    props.dispatch({
      type: 'delete-notification',
      payload: {
        id: props.id,
      },
    });
  };
  return (
    <Snackbar
      style={{
        borderWidth: 2,
        borderColor:
          props.severity === 'success'
            ? 'green'
            : props.severity === 'error'
            ? 'red'
            : 'orange',
      }}
      visible
      onDismiss={onDismissSnackBar}
      action={{
        label: 'Clear',
        onPress: onDismissSnackBar,
      }}>
      <Text style={{color: 'white'}}>
        {props.title}:{props.description}
      </Text>
    </Snackbar>
  );
};

const Notifications = () => {
  const [state, dispatch] = useContext(NotificationsContext);

  return (
    <View>
      {state.notifications.map(i => {
        return <Message {...i} dispatch={dispatch} key={i.id} />;
      })}
    </View>
  );
};
export default Notifications;
