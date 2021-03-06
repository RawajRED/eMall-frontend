import React from 'react';
import { Dimensions, Image, StyleSheet, View, FlatList, TouchableOpacity, ScrollView } from 'react-native';
const [width, height] = [Dimensions.get('window').width, Dimensions.get('window').height];
import { RFPercentage } from 'react-native-responsive-fontsize';
import SellerCardProduct from './SellerCardProduct';
import TextLato from '../../utils/TextLato';
import Icon from '../../utils/Icon';
import { gStyles } from '../../../global.style';
import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useLanguage } from '../../../hooks/language';
import HTTP from '../../../src/utils/axios';

const SellerCard = ({ seller, showToast }) => {
    const navigation = useNavigation();
    const [reviews, setReviews] = useState({average: 0, number: 0})
    const language = useLanguage();
    const en = language === 'en';
    const [aspectRatio, setAspectRatio] = useState(0);
    useEffect(() => {
        Image.getSize(seller.logo, (width, height) => setAspectRatio(width/height))
        HTTP(`/store/reviews/overview/${seller._id}`)
        .then(res => setReviews(res));
    }, []);
    return (
            <View style={styles.container}>
                <View style={styles.topContainer}>
                    <TouchableOpacity onPress={() => navigation.push('Store', {store: seller})} activeOpacity={0.7} >
                    <View style={{...styles.logoContainer, left: en ? width * 0.02 : null, right: en ? null : width * 0.02}}>
                                <Image source={{uri: seller.logo}} style={{...styles.logo}} />
                    </View>
                    <View style={{...headerStyles.container, alignItems: en ? 'flex-start' : 'flex-end', paddingHorizontal:width * 0.27}}>
                        <TextLato style={headerStyles.title}>{seller.title}</TextLato>
                        <View style={[styles.categoriesContainer, {justifyContent: en ? 'flex-start' : 'flex-end'}]}>
                            {seller.categories.slice(0,4).map(details => {
                                return <View key={details._id} style={styles.categoryContainer}><Image source={{uri: details.image}} style={styles.categoryImage} /></View>
                            })}
                            <Icon type={'AntDesign'} color="white" name={'plus'} style={styles.categoryContainer} size={RFPercentage(1.7)} />
                        </View>
                        <View style={styles.reviewsContainer}>
                            {[0, 1, 2, 3, 4].map((elem) => {
                                const num = reviews.average - elem;
                                return num > 0.5 ? 
                                <Icon type="FontAwesome" key={elem} name="star" size={RFPercentage(1.3)} color="#ffe234" /> : num > 0 ?
                                <Icon type="FontAwesome" key={elem} name="star-half" size={RFPercentage(1.3)} color="#ffe234" /> :
                                <Icon type="FontAwesome" key={elem} name="star" size={RFPercentage(1.3)} color="#aaa" />
                            })}
                            <TextLato style={styles.reviewNumber}>({reviews.number})</TextLato>
                        </View>
                    </View>
                            </TouchableOpacity>
                </View>
                <FlatList
                    data={seller.products}
                    renderItem={product => <SellerCardProduct showToast={showToast} style={{marginHorizontal: width * 0.02, marginVertical: height * 0.015}} product={product.item} />}
                    keyExtractor={product => product._id}
                    style={{transform: en ? [] : [{scaleX: -1}]}}
                    horizontal
                />
                <TouchableOpacity style={styles.moreButton} onPress={() => navigation.push('Store', {store: seller, state: 1})}>
                    <TextLato style={{color: gStyles.color_3, fontSize: RFPercentage(2)}}>{en ? 'View More' : '?????? ????????????'}</TextLato>
                </TouchableOpacity>
            </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: width * 0.93,
        backgroundColor: 'white',
        marginBottom: height * 0.035,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 6,
        alignItems: 'center'
    },
    topContainer: {
        width: '90%'
    },
    logoContainer: {
        width: width * 0.23,
        justifyContent: 'center',
        alignItems: 'center',
        aspectRatio: 1,
        shadowColor: "#000",
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: 0.4,
        shadowRadius: 3.84,
        elevation: 5,
        borderRadius: 200,
        position: 'absolute',
        top: height * -0.025,
        left: width * 0.02,
        backgroundColor: 'white',
    },
    logo: {
        width: width * 0.23,
        aspectRatio: 1,
        borderRadius: 400,
        resizeMode: 'cover',
        // backgroundColor: 'cyan'
    },
    reviewsContainer: {
        flexDirection: 'row',
        marginTop: height * 0.004,
        alignItems: 'center'
    },
    reviewNumber: {
        fontSize: RFPercentage(1.3),
        marginLeft: width * 0.01
    },
    categoriesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-end',
    },
    categoryContainer: {
        width: width * 0.08,
        height: width * 0.07,
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
});

const headerStyles = StyleSheet.create({
    container: {
        marginTop: height * 0.01,
    },
    title: {
        fontSize: RFPercentage(2.2)
    }
})

export default SellerCard;