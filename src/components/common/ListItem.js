import {View, Text, StyleSheet} from 'react-native';
import {IconButton} from 'react-native-paper';
import moment from 'moment';
import firestore from '@react-native-firebase/firestore';
import firebaseAuth from '@react-native-firebase/auth';

const deleteItem = async id => {
  const userRef = firestore()
    .collection('users')
    .doc(firebaseAuth().currentUser.uid);
  const userSnap = await userRef.get();
  const itemList = userSnap.data().itemList;

  await userRef.update({
    itemList: itemList.filter(item => item.id !== id),
  });
  await firestore().collection('groceryItems').doc(id).delete();
};

const ListItem = ({label, expiryDate, id, editItem}) => {
  const isExpired = Date.now() > expiryDate.seconds * 1000;
  return (
    <View style={styles.wrapperStyles}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Text style={styles.labelStyle}>{label}</Text>

        <View style={{flexDirection: 'row'}}>
          <IconButton
            icon="pencil"
            style={{marginRight: 0}}
            size={20}
            onPress={editItem}
          />
          <IconButton
            icon="delete"
            size={20}
            onPress={() => {
              deleteItem(id);
            }}
          />
        </View>
      </View>
      {isExpired ? (
        <Text style={[styles.expiryDateStyles, {color: 'red'}]}>
          Expired on{' '}
          {moment(new Date(expiryDate.seconds * 1000)).format('MMM Do YY')}
        </Text>
      ) : (
        <Text style={styles.expiryDateStyles}>
          {moment(new Date(expiryDate.seconds * 1000)).format('MMM Do YY')}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapperStyles: {
    borderWidth: 1,
    borderColor: '#d8d9cf',
    borderStyle: 'solid',
    borderRadius: 8,
    padding: 8,
    margin: 15,
  },
  expiryDateStyles: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  labelStyle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
export default ListItem;
