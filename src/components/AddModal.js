import {useState, useCallback} from 'react';
import ModalFormat from './common/Modal';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import {TextInput, Button} from 'react-native-paper';
import {DatePickerModal} from 'react-native-paper-dates';
import moment from 'moment';
// import Members from './common/Members';
import firestore from '@react-native-firebase/firestore';
import firebaseAuth from '@react-native-firebase/auth';

const AddModal = props => {
  const [itemName, setItemName] = useState('');
  const [date, setDate] = useState(null);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [addingItem, setAddingItem] = useState(false);
  const [collaborators, setCollaborators] = useState([]);

  const addListItem = async () => {
    setAddingItem(true);
    const auth = firebaseAuth();
    const userRef = firestore().collection('users').doc(auth.currentUser.uid);
    const newItemRef = await firestore()
      .collection('groceryItems')
      .add({
        expiryDate: new Date(date),
        label: itemName,
        owner: userRef,
        collaborators,
      });

    await userRef.update({
      itemList: [...props.userData.itemList, newItemRef],
    });
    setAddingItem(false);
    setItemName('');
    setDate(null);
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
      title="Add new item">
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
      {/* <View>
        <Text>Collaborators</Text>
        <Members
          collaborators={collaborators}
          setCollaborators={setCollaborators}
        />
      </View> */}
      <View style={{justifyContent: 'flex-end', flexDirection: 'row'}}>
        <Button
          icon="plus"
          mode="contained"
          style={{marginRight: 15}}
          onPress={addListItem}>
          Add
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
export default AddModal;
