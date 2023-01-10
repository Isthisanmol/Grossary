import {Chip, TextInput} from 'react-native-paper';
import {StyleSheet, View, Text} from 'react-native';
import {useState, Fragment} from 'react';

import firebaseAuth from '@react-native-firebase/auth';
import functions from '@react-native-firebase/functions';
import firestore from '@react-native-firebase/firestore';

const Members = ({collaborators, setCollaborators}) => {
  const [addCollatoratorOpen, setAddCollaboratorOpen] = useState(false);
  const [collabEmail, setCollabEmail] = useState('');
  const [errorText, setErrorText] = useState('');

  const onAddCollaborator = async () => {
    const auth = firebaseAuth();
    if (collabEmail === auth.currentUser.email) {
      setErrorText('Cannot add yourself as collaborator!');

      return;
    }
    if (
      !Boolean(
        collabEmail
          .toLowerCase()
          .trim()
          .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          ),
      )
    ) {
      setErrorText('Enter correct email id');
      return;
    }
    try {
      const user = await functions().httpsCallable('getUserProfile')({
        email: collabEmail,
      });
      const uid = user.data.uid;
      const docSnap = await firestore().collection('users').doc(uid).get();
      const {name, photo = null} = docSnap.data();

      setCollaborators([
        ...collaborators,
        {name, photo, email: collabEmail, uid},
      ]);
    } catch (e) {
      console.error(e);
      setErrorText("User doesn't exist");
    }
  };

  const removeCollaborator = id => {
    setCollaborators(collaborators.filter(({uid}) => uid !== id));
  };

  return (
    <View style={styles.container}>
      <View style={styles.chips}>
        {collaborators.map(i => {
          return (
            <Chip
              icon="close"
              onPress={() => removeCollaborator(i.uid)}
              key={i.uid}>
              {i.name}
            </Chip>
          );
        })}
        {!addCollatoratorOpen ? (
          <Chip
            icon="account-multiple-plus"
            onPress={() => {
              setAddCollaboratorOpen(true);
            }}>
            Add
          </Chip>
        ) : null}
      </View>
      {addCollatoratorOpen ? (
        <Fragment>
          <TextInput
            label="Email"
            value={collabEmail}
            onChangeText={setCollabEmail}
            autoFocus
            onBlur={() => {
              if (collabEmail) {
                setAddCollaboratorOpen(true);
              } else {
                setAddCollaboratorOpen(false);
              }
            }}
            onSubmitEditing={onAddCollaborator}
          />

          <Text style={{color: 'red'}}>{errorText}</Text>
        </Fragment>
      ) : null}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  chips: {
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
});

export default Members;
