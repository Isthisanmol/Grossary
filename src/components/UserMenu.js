import {View} from 'react-native';
import {useState} from 'react';
import {Button, Menu, Provider, Avatar} from 'react-native-paper';

const UserMenu = ({signOutUser, userData}) => {
  const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  return (
    <View>
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={
          <Button
            icon={({size, color}) => {
              if (userData?.profilePhoto) {
                return (
                  <Avatar.Image
                    size={36}
                    source={{uri: userData?.profilePhoto}}
                  />
                );
              }
              const names = userData?.name?.toUpperCase()?.split(' ');
              if (names?.length) {
                const [firstName, lastName] = names;
                const label = `${firstName.charAt(0)}${
                  lastName ? lastName.charAt(0) : ''
                }`;
                return <Avatar.Text size={36} label={label} />;
              }
            }}
            onPress={openMenu}></Button>
        }>
        {/* <Button
          icon="cog"
          title="Settings"
          onPress={() => console.log('Pressed')}>
          Settings
        </Button> */}
        <Button icon="logout" onPress={signOutUser} title="Logout">
          Logout
        </Button>
      </Menu>
    </View>
  );
};

export default UserMenu;
