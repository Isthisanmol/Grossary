import {TextInput, Button} from 'react-native-paper';
import {Text, View, StyleSheet} from 'react-native';
import {useState} from 'react';

const SignUpForm = ({switchForm, onSignup, loaderVisible}) => {
  const [isSignupVisible, setIsSignupVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState(false);

  return (
    <View style={{flex: 1, justifyContent: 'center', padding: 20}}>
      <Text style={styles.titleStyle}>Sign Up</Text>
      <TextInput
        style={styles.textinputStyle}
        label="Name"
        mode="outlined"
        value={name}
        onChangeText={setName}
        onBlur={() => {
          if (name.trim().length < 3) {
            setNameError(true);
          } else {
            setNameError(false);
          }
        }}
        error={nameError}
      />
      <TextInput
        style={styles.textinputStyle}
        mode="outlined"
        label="Email"
        value={email}
        onChangeText={setEmail}
        error={emailError}
        onBlur={() => {
          if (
            Boolean(
              email
                .toLowerCase()
                .trim()
                .match(
                  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                ),
            )
          ) {
            setEmailError(false);
          } else {
            setEmailError(true);
          }
        }}
      />

      <TextInput
        style={styles.textinputStyle}
        label="Password"
        secureTextEntry
        mode="outlined"
        value={password}
        onChangeText={setPassword}
        onBlur={() => {
          if (password.trim().length < 3) {
            setPasswordError(true);
          } else {
            setPasswordError(false);
          }
        }}
        error={passwordError}
      />

      <Button
        style={styles.solidButtonStyle}
        loading={loaderVisible}
        mode="contained"
        onPress={() => onSignup({email, password, name})}>
        Sign Up
      </Button>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={{fontWeight: 'bold', fontSize: 16}}>Already a user?</Text>
        <Button mode="text" onPress={switchForm}>
          LOGIN
        </Button>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  titleStyle: {
    alignSelf: 'center',
    marginBottom: 25,
    fontSize: 35,
    fontWeight: 'bold',
  },
  textinputStyle: {
    marginBottom: 20,
  },
  solidButtonStyle: {
    marginBottom: 15,
  },
});

export default SignUpForm;
