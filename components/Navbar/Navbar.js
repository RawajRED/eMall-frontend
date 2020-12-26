import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Dimensions, Text } from 'react-native';
import Searchbar from './Searchbar';
import { FontAwesome5 } from '@expo/vector-icons';
import { gStyles } from '../../global.style';
import { connect } from 'react-redux';
import useLanguage from '../../hooks/language';

const width = Dimensions.get('window').width;

function Navbar(props){
    const [disabled, setDisabled] = useState(false);
    const [language, languageState] = useLanguage('navbar');

    useEffect(() => {
        const timer = setTimeout(() => setDisabled(false), 1000);
        return () => clearTimeout(timer);
    }, [disabled])
    return(
        <View style={styles.container}>
            <View style={getLanguageStyle(languageState, 'topContainer')}>
                {/* Burger */}
                <TouchableOpacity onPress={props.navigation.openDrawer} style={styles.burgerContainer}>
                    <FontAwesome5 name="bars" color={gStyles.secondary_dark} size={ 27 }/>
                </TouchableOpacity>

                {/* Logo */}
                <View style={styles.logoContainer}>
                    <Image source={require('../../assets/logoM.png')} style={styles.logo} />
                </View>
                
                {/* Cart */}
                <TouchableOpacity 
                    disabled={disabled}
                    onPress={() => {
                        setDisabled(true);
                        props.navigation.push('Cart', {cart: props.cart})}
                    }
                    style={styles.burgerContainer}
                >
                    <View style={styles.cartNumberContainer}>
                        <Text>{props.cart.length}</Text>
                    </View>
                    <FontAwesome5 name="shopping-cart" color={gStyles.secondary_dark} size={ 27 }/>
                </TouchableOpacity>
            </View>
            {/* Search Bar */}
            <Searchbar />

        </View>
    )
}

const getLanguageStyle = (lang, style) => lang ? styles[`${style}_ar`] : styles[style];

const styles = StyleSheet.create({
    container: {
        width,
        height: 100,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    topContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        height: 45
    },
    topContainer_ar: {
        display: 'flex',
        flexDirection: 'row-reverse',
        alignItems: 'center',
        height: 45
    },
    logoContainer: {
        width: width * 0.7,
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row'
    },
    logo: {
        width: 50,
        height: 50,
        zIndex: 1
    },
    cartNumberContainer: {
        backgroundColor: gStyles.primary_medium,
        width: 18,
        height: 18,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        transform: [{translateX: -9}, {translateY: 0}],
        zIndex: 2,
        position: "absolute"
    },
    burgerContainer: {
        width: width * 0.15,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
    }
})

const mapStateToProps = (state) => {
    return {
        cart: state.cartReducer.cart
    }
}

export default connect(mapStateToProps)(Navbar);