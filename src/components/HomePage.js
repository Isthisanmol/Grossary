import {useState, useRef, useEffect} from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {FAB, Button, useTheme} from 'react-native-paper';
import UserMenu from './UserMenu';
import AddModal from './AddModal';
import EditModal from './EditModal';
import ListItem from './common/ListItem';
import firestore from '@react-native-firebase/firestore';
import firebaseAuth from '@react-native-firebase/auth';
import functions from '@react-native-firebase/functions';
import messaging from '@react-native-firebase/messaging';

const HomePage = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [itemList, setItemList] = useState([]);
  const [userData, setUserData] = useState(null);
  const [editDetails, setEditDetails] = useState(null);
  const theme = useTheme();

  const unsubRef = useRef();

  useEffect(() => {
    const auth = firebaseAuth();
    getData(auth);
    unsubRef.current = firestore()
      .collection('users')
      .doc(auth.currentUser.uid)
      .onSnapshot(d => {
        if (d.exists) {
          const user = d.data();
          setUserData(user);
          populateItems(user.itemList);
        }
      });

    return () => unsubRef.current();
  }, []);
  const getData = async auth => {
    try {
      const docSnap = await firestore()
        .collection('users')
        .doc(auth.currentUser.uid)
        .get();

      if (docSnap.exists) {
        const user = docSnap.data();
        setUserData(user);
        populateItems(user.itemList);
        setupFCM(auth, user);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const populateItems = async itemRefs => {
    const itemSnapPromises = itemRefs.map(r => r.get());
    const itemSnapshots = await Promise.all(itemSnapPromises);
    const items = itemSnapshots
      .filter(r => r.exists)
      .map(i => {
        return {
          ...i.data(),
          id: i.id,
        };
      });
    setItemList(items);
  };

  const setupFCM = async (auth, user) => {
    await messaging().registerDeviceForRemoteMessages();
    const deviceToken = await messaging().getToken();
    const {fcmTokens = []} = user;
    if (!fcmTokens.includes(deviceToken)) {
      await firestore()
        .collection('users')
        .doc(auth.currentUser.uid)
        .update({
          fcmTokens: [...fcmTokens, deviceToken],
        });
    }
  };

  const signOutUser = async () => {
    const auth = firebaseAuth();

    try {
      const deviceToken = await messaging().getToken();
      const docRef = firestore().collection('users').doc(auth.currentUser.uid);
      const docSnap = await docRef.get();
      const {fcmTokens = []} = docSnap.data();
      await docRef.update({
        fcmTokens: fcmTokens.filter(d => d !== deviceToken),
      });
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => {
        auth.signOut();
      }, 1000);
    }
  };

  const onSearch = async () => {
    const result = await firestore()
      .collection('groceryItems')
      .where('label', '>=', searchText)
      .where('label', '<=', searchText + '\uf8ff')
      .get();
    setItemList(
      result.docs.map(i => {
        return {
          ...i.data(),
          id: i.id,
        };
      }),
    );
  };

  return (
    <View style={{flex: 1}}>
      <View
        style={[styles.searchBar, {backgroundColor: theme.colors.background}]}>
        <TextInput
          style={[styles.input, {backgroundColor: theme.colors.background}]}
          onChangeText={setSearchText}
          onSubmitEditing={onSearch}
          value={searchText}
          placeholder="Search groceries here "
        />
        {searchText ? (
          <Button
            icon="close"
            onPress={() => {
              setSearchText('');
              const auth = firebaseAuth();
              getData(auth);
            }}></Button>
        ) : null}
        <UserMenu signOutUser={signOutUser} userData={userData} />
      </View>
      <FlatList
        data={itemList}
        renderItem={({item}) => {
          return (
            <ListItem
              {...item}
              editItem={() => {
                setEditDetails(item);
              }}
            />
          );
        }}
        keyExtractor={i => i.id}
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => setIsAddModalOpen(true)}
      />
      {editDetails ? (
        <EditModal
          isOpen={true}
          editDetails={editDetails}
          closeModal={() => setEditDetails(null)}
          userData={userData}
        />
      ) : null}

      <AddModal
        isOpen={isAddModalOpen}
        closeModal={() => {
          setIsAddModalOpen(false);
        }}
        userData={userData}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    flex: 1,
    paddingLeft: 0,
  },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 30,
    height: 60,
    padding: 4,
    paddingLeft: 20,
    elevation: 4,
    margin: 8,
    marginBottom: 0,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default HomePage;
