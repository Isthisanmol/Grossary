import {useState, useCallback} from 'react';
import ModalFormat from './common/Modal';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {TextInput, Button} from 'react-native-paper';
import {DatePickerModal} from 'react-native-paper-dates';
import moment from 'moment';
import firestore from '@react-native-firebase/firestore';
import firebaseAuth from '@react-native-firebase/auth';

const EditModal = props => {
  const [itemName, setItemName] = useState(props.editDetails.label);
  const [date, setDate] = useState(
    new Date(props.editDetails.expiryDate.seconds * 1000),
  );
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  console.log(date, 'check');
  const editListItem = async () => {
    setIsLoading(true);
    const auth = firebaseAuth();
    const userRef = firestore().collection('users').doc(auth.currentUser.uid);
    await firestore()
      .collection('groceryItems')
      .doc(props.editDetails.id)
      .update({
        expiryDate: new Date(date),
        label: itemName,
      });
    console.log(date, '2ndcheck');

    userRef.update({
      lastUpdated: Date.now(),
    });
    setIsLoading(false);
    props.closeModal();
  };

  const onDismissSingle = useCallback(() => {
    setIsDatePickerVisible(false);
  }, [isDatePickerVisible]);

  const onConfirmSingle = useCallback(
    params => {
      setIsDatePickerVisible(false);
      setDate(params.date);
    },
    [isDatePickerVisible, date],
  );

  return (
    <ModalFormat
      isOpen={props.isOpen}
      closeModal={props.closeModal}
      title="Edit item">
      <View>
        <TextInput
          style={styles.textinputStyle}
          mode="outlined"
          label="Grocery item"
          value={itemName}
          onChangeText={setItemName}
        />
      </View>
      <View>
        <TouchableOpacity
          onPress={() => {
            setIsDatePickerVisible(true);
          }}>
          <TextInput
            style={styles.textinputStyle}
            mode="outlined"
            label="Expiry Date"
            value={date ? moment(date).format('MMM Do YY') : ''}
            editable={false}
          />
        </TouchableOpacity>
        <DatePickerModal
          locale="en"
          mode="single"
          visible={isDatePickerVisible}
          onDismiss={onDismissSingle}
          date={date}
          onChange={onConfirmSingle}
        />
      </View>
      <View style={{justifyContent: 'flex-end', flexDirection: 'row'}}>
        <Button
          disabled={isLoading}
          loading={isLoading}
          icon="plus"
          mode="contained"
          style={{marginRight: 15}}
          onPress={editListItem}>
          Save
        </Button>

        <Button icon="close" mode="outlined" onPress={props.closeModal}>
          Close
        </Button>
      </View>
    </ModalFormat>
  );
};

const styles = StyleSheet.create({
  textinputStyle: {
    marginBottom: 15,
  },
});
export default EditModal;
