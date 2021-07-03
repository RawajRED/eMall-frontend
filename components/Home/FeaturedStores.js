import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Image, StyleSheet, View, FlatList, ImageBackground } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { gStyles } from '../../global.style';
const [width, height] = [Dimensions.get('window').width, Dimensions.get('window').height];
import { useLanguage } from '../../hooks/language';
import HTTP from '../../src/utils/axios';
import Icon from '../utils/Icon';
import TextLato from '../utils/TextLato';

const FeaturedStores = () => {
    const [stores, setStores] = useState([]);
    const language = useLanguage();
    const en = language === 'en';
    const navigation = useNavigation();
    useEffect(() => {
        HTTP('/advertisement/featured-stores')
        .then(res => {console.log(res);setStores(res)})
    }, []);
    return (
        <View>
            <TextLato bold style={styles.title}>{en ? 'Featured Stores' : 'محلات مميزة'}</TextLato>
            <View style={styles.storesContainer}>
                {stores.length > 0 ? (
                    <FlatList
                        data={stores}
                        horizontal
                        renderItem={store => <StoreCard store={store.item} />}
                        keyExtractor={store => store._id}
                        style={{transform: en ? [] : [{scaleX: -1}]}}
                        contentContainerStyle={{paddingVertical: height * 0.01, alignItems: 'center'}}
                    />
                ): [1,2,3,4,5,6].map(num => {
                    return (
                        <View key={num} style={styles.product}>
                            <View style={styles.innerProductWait}>
                                <ActivityIndicator color={'white'} size={RFPercentage(3.5)} />
                            </View>
                        </View>
                    )
                })}
            </View>
        </View>
    )
}

const StoreCard = ({store}) => {
    console.log(store)
    const language = useLanguage();
    const en = language === 'en';
    return (
        <View style={styles.storeContainer}>
            <Image style={styles.image} source={{uri: store.page?.coverImage || 'https://image.freepik.com/free-vector/red-oriental-chinese-seamless-pattern-illustration_193606-43.jpg'}} />
            <View style={styles.bottomContainer}>
                <ImageBackground source={{uri: store.logo}} style={styles.logoContainer} imageStyle={styles.logoImage} />
                <View style={{marginLeft: width * 0.25, paddingTop: height * 0.01}}>
                    <TextLato bold style={styles.storeTitle}>{store.title}</TextLato>
                        <View style={[styles.categoriesContainer, {justifyContent: en ? 'flex-start' : 'flex-end'}]}>
                            {store.categories.slice(0,4).map(details => {
                                return <View key={details._id} style={styles.categoryContainer}><Image source={{uri: details.image}} style={styles.categoryImage} /></View>
                            })}
                            <Icon type={'AntDesign'} color="white" name={'plus'} style={styles.categoryContainer} size={RFPercentage(1.7)} />
                        </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: RFPercentage(2.5),
        marginHorizontal: width * 0.03,
        marginTop: height * 0.03,
    },
    storesContainer: {
        marginVertical: height * 0.01,
        paddingVertical: height * 0.005
    },
    storeContainer: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        
        elevation: 6,
        marginHorizontal: width * 0.03,
        width: width * 0.8,
        borderRadius: 40,
        height: height * 0.18,
        backgroundColor: 'white'
    },
    image: {
        width: '100%',
        height: '60%',
        resizeMode: 'cover',
        borderTopRightRadius: 40,
        borderTopLeftRadius: 40
    },
    bottomContainer: {
        paddingHorizontal: width * 0.05
    },
    logoContainer: {
        width: width * 0.25,
        backgroundColor: 'white',
        paddingHorizontal: width * 0.04,
        paddingVertical: width * 0.04,
        aspectRatio: 1,
        resizeMode: 'cover',
        borderRadius: 300,
        position: 'absolute',
        transform: [{translateY: -width * 0.15}, {translateX: width * 0.03}],
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        
        elevation: 6,

    },
    logoImage: {
        borderRadius: 300,
    },
    storeTitle: {
        color: 'black',
        fontSize: RFPercentage(2),
    },
    categoriesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-end',
    },
    categoryContainer: {
        width: width * 0.05,
        height: width * 0.05,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        backgroundColor: gStyles.color_3,
        marginRight: width * 0.01,
        marginTop: height * 0.005,
        paddingHorizontal: width * 0.01
    },
    categoryImage: {
        width: '100%',
        aspectRatio: 1,
        resizeMode: 'contain',
        tintColor: 'white'
    },
    moreButton: {
        marginVertical: height * 0.01,
        height: height * 0.05,
        backgroundColor: '#ebebeb',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        width: '90%'
    }
})

export default FeaturedStores;