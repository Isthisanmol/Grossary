import {Modal, StyleSheet, View, Text} from 'react-native';
import {Button, useTheme} from 'react-native-paper';

const ModalFormat = props => {
  const theme = useTheme();
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={props.isOpen}
      onRequestClose={props.closeModal}>
      <View style={styles.centeredView}>
        <View
          style={[
            styles.modalView,
            {backgroundColor: theme.colors.background},
          ]}>
          <Text style={([styles.textStyle], {color: theme.colors.primary})}>
            {props.title}
          </Text>

          <View>{props.children}</View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },

  modalView: {
    margin: 20,
    // backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    shadowColor: '#000',
    alignSelf: 'stretch',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  textStyle: {
    marginBottom: 15,
    // color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ModalFormat;
