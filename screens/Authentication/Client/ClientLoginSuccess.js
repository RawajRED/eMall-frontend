import React from 'react';
import { Alert, Dimensions, StyleSheet, View } from 'react-native';
import { TouchableNativeFeedback, TouchableOpacity } from 'react-native-gesture-handler';
import Constants from 'expo-constants';
import { gStyles } from '../../../global.style';
import { Feather } from '@expo/vector-icons';
import InputOneCharacter from '../InputOneCharacter';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import { useState } from 'react';
import { connect } from 'react-redux';
import { login } from '../../../src/actions/auth';
import { changeFirstTime } from '../../../src/actions/general';
import TextLato from '../../../components/utils/TextLato';
import AsyncStorage from '@react-native-async-storage/async-storage';

const [width, height] = [Dimensions.get('window').width, Dimensions.get('window').height];

function ClientLoginSuccess(props) {
    const [input0, setInput0] = useState(''),
          [input1, setInput1] = useState(''),
          [input2, setInput2] = useState(''),
          [input3, setInput3] = useState(''),
          [input4, setInput4] = useState('');
    const account = props.route.params.account;
    const submitOtp = () => {
        fetch(`${Constants.manifest.extra.apiUrl}/client/login/otp`, {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({...props.route.params.account, otp: `${input0}${input1}${input2}${input3}${input4}`})
        })
        .then(res => {
            if(res.ok){
                return res.json();
            }
            else {
                throw new Error('Incorrect PIN');
            }
        })
        .then(res => {
            props.login(res);
            AsyncStorage.setItem('@firstTime', 'true');
            props.changeFirstTime(true);
            // props.navigation.navigate('Home');
        })
        .catch(err => Alert.alert(
            "Problem with Verification",
            err.message
        ));
    }
    return (
    <View style={styles.container}>
        <Feather name="check-circle" size={RFValue(130)} color={gStyles.color_0} />
        <TextLato style={styles.welcomeText}>Greetings, {account.firstName}</TextLato>
        <View style={styles.subtitle}>
            <TextLato style={{fontSize: RFPercentage(1.6)}}>An email has been sent to your email account</TextLato>
            <TextLato  style={{fontSize: RFPercentage(1.6), fontWeight: 'bold', color: gStyles.color_0}}>{account.email}</TextLato>
            <TextLato style={{fontSize: RFPercentage(1.6)}}>Please enter the code that was provided in the email</TextLato>
        </View>
        <InputOneCharacter
            input0={input0} setInput0={setInput0}
            input1={input1} setInput1={setInput1}
            input2={input2} setInput2={setInput2}
            input3={input3} setInput3={setInput3}
            input4={input4} setInput4={setInput4} />
        <TouchableOpacity activeOpacity={0.9} onPress={submitOtp}>
            <TextLato style={styles.backButton}>Submit</TextLato>
        </TouchableOpacity>
    </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height,
        backgroundColor: gStyles.background,
        paddingTop: Constants.statusBarHeight + height * 0.15,
        // justifyContent: 'center',
        alignItems: 'center'
    },
    welcomeText: {
        fontSize: RFPercentage(4),
        width: width * 0.8,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    subtitle: {
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        width: width * 0.8,
        fontSize: RFValue(10),
        flexDirection: 'column',
    },
    backButton: {
        paddingVertical: height * 0.015,
        width: width * 0.8,
        textAlign: 'center',
        color: 'white',
        fontSize: RFPercentage(2),
        backgroundColor: gStyles.color_0,
        borderRadius: 4
    }
})

const mapStateToProps = (state) => {
    return {
        loggedIn: state.authReducer.loggedIn,
        account: state.authReducer.account,
        token: state.authReducer.token
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        login: (account) => dispatch(login(account)),
        changeFirstTime: (firstTime) => dispatch(changeFirstTime(firstTime))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ClientLoginSuccess);