import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, Dimensions, KeyboardAvoidingView, ImageBackground, Switch, ActivityIndicator } from 'react-native';
import TextLato from '../../../components/utils/TextLato';
import Constants from 'expo-constants';
import { gStyles } from '../../../global.style';
import Icon from '../../../components/utils/Icon';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import { ScrollView, TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
const [width, height] = [Dimensions.get('window').width, Dimensions.get('window').height]
import { useHeaderHeight } from '@react-navigation/stack';
import AwesomeAlert from 'react-native-awesome-alerts';
import { funcs } from '../../../global.funcs';
import Header from '../../../components/Header';
import { useRef } from 'react';
import { useLanguage } from '../../../hooks/language';
import HTTP from '../../../src/utils/axios';

const isEmpty = (obj) => Object.keys(obj).length === 0;

const StoreProductsAdd = ({route, navigation}) => {
    const prodId = route.params._id;
    const headerHeight = useHeaderHeight();
    const language = useLanguage();
    const en = language === 'en';
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [filters, setFilters] = useState([]);
    
    const [enTitle, setEnTitle] = useState('');
    const [enTitleErr, setEnTitleErr] = useState('');
    
    const [arTitle, setArTitle] = useState('');
    const [arTitleErr, setArTitleErr] = useState('');
    
    const [enDescription, setEnDescription] = useState('');
    const [enDescriptionErr, setEnDescriptionErr] = useState('');
    
    const [arDescription, setArDescription] = useState('');
    const [arDescriptionErr, setArDescriptionErr] = useState('');
    
    const [pickedCategory, setPickedCategory] = useState('');
    const [pickedCategoryErr, setPickedCategoryErr] = useState('');
    
    const [pickedSubcategory, setPickedSubcategory] = useState('');
    const [pickedSubcategoryErr, setPickedSubcategoryErr] = useState('');
    
    const [pickedFilter, setPickedFilter] = useState('');
    const [pickedFilterErr, setPickedFilterErr] = useState('');

    const [discount, setDiscount] = useState('0');
    
    const [stock, setStock] = useState('');
    const [stockErr, setStockErr] = useState('');
    
    const [price, setPrice] = useState('');
    const [priceErr, setPriceErr] = useState('');
    
    const [specifications, setSpecfications] = useState([]);
    const [images, setImages] = useState([]);

    const [extraText, setExtraText] = useState(false);
    const [extraImage, setExtraImage] = useState(false);

    const token = useSelector(state => state.authReducer.token)
    
    const [showAlert, setShowAlert] = useState(false);

    const [loading, setLoading] = useState(true);

    const scroll = useRef();

    useEffect(() => {
        HTTP(`/product/${prodId}`)
        .then(res => {
            setLoading(false);
            setEnTitle(res.title.en);
            setArTitle(res.title.ar);
            setEnDescription(res.description.en);
            setArDescription(res.description.ar);
            setStock(res.stock + '');
            setPrice(res.price + '');
            setImages(res.images.map(image => ({uri: image, id: Math.random()})));
            setPickedCategory(res.category);
            setPickedSubcategory(res.subcategory);
            setPickedFilter(res.filter);
            setExtraImage(res.extraImage || false);
            setExtraText(res.extraText || false);
            HTTP('/category')
            .then(res => setCategories(res))
            .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
    }, []);
    
    useEffect(() => {
        if(!isEmpty(pickedCategory)){
            HTTP(`/subcategory/find-by-category/${pickedCategory}`)
            .then(res => {setSubcategories(res)})
            .catch(err => console.log(err))
        }
    }, [pickedCategory])
    
    useEffect(() => {
        if(!isEmpty(pickedSubcategory)){
            HTTP(`/subcategory/filters/${pickedSubcategory}`)
            .then(res => {setFilters(res)})
            .catch(err => console.log(err))
        }
    }, [pickedSubcategory])
    
    const submitProduct = () => {
        const imgs = images.map(image => image.uri);
        funcs.uploadMultipleImages(imgs)
        .then(res => {
            const product = {
                _id: prodId,
                title: {
                    en: enTitle,
                    ar: arTitle
                },
                description: {
                    en: enDescription,
                    ar: arDescription
                },
                category: pickedCategory,
                subcategory: pickedSubcategory,
                filter: pickedFilter,
                stock,
                price,
                extraImage,
                extraText,
                currency: 'EGP',
                images: res
            };
            fetch(`${Constants.manifest.extra.apiUrl}/product`, {
                method: 'put',
                headers: {'Content-Type': 'application/json', token},
                body: JSON.stringify({product})
            })
            .then(res => res.json(res))
            .then(res => {
                if(res.status || res.errors){
                    scroll.current.scrollTo({y: 0, animated: true});
                    setEnTitleErr('');
                    setArTitleErr('');
                    setPickedCategoryErr('');
                    setPickedSubcategoryErr('');
                    setPickedFilterErr('');
                    setStockErr('');
                    setPriceErr('');
                    res.errors.map(err => {
                        switch(err.param){
                            case 'product.title.en': setEnTitleErr(err.msg); break;
                            case 'product.title.ar': setArTitleErr(err.msg); break;
                            case 'product.category': setPickedCategoryErr(err.msg); break;
                            case 'product.subcategory': setPickedSubcategoryErr(err.msg); break;
                            case 'product.filter': setPickedFilterErr(err.msg); break;
                            case 'product.stock': setStockErr(err.msg); break;
                            case 'product.price': setPriceErr(err.msg); break;
                        }
                    })
                } else {
                    setShowAlert(true);
                }
            })
            .catch(err => console.log('ERRR', err));
        }).catch(err => console.log(err));
    }

    const removeImage = (id) => {
        setImages(images => images.filter(image => image.id !== id));
    }

    const checkNotEmpty = () => {
        return enTitle && arTitle && pickedCategory && pickedSubcategory && pickedFilter && stock && price && images.length !== 0 && images.length <= 10;
    }

    const Alert = () => (
        <AwesomeAlert
        show={showAlert}
        showProgress={false}
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        confirmButtonColor="#DD6B55"
        contentContainerStyle={{backgroundColor: gStyles.color_0}}
        customView={(
            <View style={{justifyContent: 'center', alignItems: 'center', backgroundColor: gStyles.color_0}}>
                <Icon type="Feather" name="check" size={RFValue(60)} color={'white'} />
                <TextLato bold style={{fontSize: RFPercentage(3), marginTop: height * 0.02, color: 'white'}}>Success</TextLato>
                <TextLato style={{fontSize: RFPercentage(2), marginTop: height * 0.04, textAlign: 'center', color: 'white'}}>You have successfully updated this product! ({enTitle})</TextLato>
            </View>
        )}
        onCancelPressed={() => {
            setShowAlert(false);
        }}
        onConfirmPressed={() => {
            props.removeFromWishlist(item)
            setShowAlert(false);
        }}
        onDismiss={() => {
            setShowAlert(false);
            navigation.popToTop();
        }}
    />
    )

    if(loading)
        return (
            <View>
                <Header details={{title: ''}} />
                <View style={{width, height, justifyContent: 'center', alignItems: 'center'}}><ActivityIndicator size={RFPercentage(5)} color={gStyles.color_2} /></View>
            </View>
        )

    return(
        <KeyboardAvoidingView keyboardVerticalOffset = {headerHeight + 64} style={styles.container}>
            <Alert />
            <Header details={{title: ''}} />
            <ScrollView ref={scroll}>
                <View style={{paddingHorizontal: 20}}>
                    <TextLato style={{fontSize: RFPercentage(3)}} bold>Update Product</TextLato>
                    <TextLato italic>Fields marked with an asterisk (*) are obligatory</TextLato>
                    <View style={styles.inputContainer}>
                        <TextErrorInput
                            value={enTitle}
                            error={enTitleErr}
                            setValue={setEnTitle}
                            title={'English Title*'}
                            placeholder={'Adidas Pro Max 20'} 
                        />
                        <TextErrorInput
                            value={arTitle}
                            error={arTitleErr}
                            setValue={setArTitle}
                            title={'Arabic Title*'}
                            placeholder={'???????????? ?????? ???????? 20'} 
                        />
                        <TextErrorInput
                            value={enDescription}
                            error={enDescriptionErr}
                            setValue={setEnDescription}
                            title={'English Description'}
                            placeholder={'A brief description describing your product...'}
                            multiline
                        />
                        <TextErrorInput
                            value={arDescription}
                            error={arDescriptionErr}
                            setValue={setArDescription}
                            title={'Arabic Description'}
                            placeholder={'?????? ???????? ?????? ?????????? ?????????? ...'} 
                            multiline
                        />
                        <TextErrorInput
                            value={stock}
                            error={stockErr}
                            setValue={setStock}
                            title={'Stock*'}
                            placeholder={'0'}
                            keyboardType={'number-pad'} 
                        />
                        <TextErrorInput
                            value={price}
                            error={priceErr}
                            setValue={setPrice}
                            title={'Price* (EGP)'}
                            placeholder={'0.00'}
                            keyboardType={'number-pad'} 
                        />
                    </View>
                </View>

                {/* IMAGES */}
                <TextLato style={styles.label}>Images</TextLato>
                <ScrollView style={styles.categories} horizontal>

                    {images.map(image => (
                    <ImageContainer
                        key={image}
                        image={image}
                        style={{...styles.imageContainer}}>
                            <TouchableOpacity onPress={() => removeImage(image.id)} style={styles.trashContainer}>
                                <Icon type="Feather" name="trash" color="white" size={RFPercentage(2.5)} />
                            </TouchableOpacity>
                    </ImageContainer>
                    ))}

                    <TouchableOpacity onPress={() => funcs.chooseImage(uri => setImages(images => [...images, {id: Math.random(), uri}]))} style={styles.addImageContainer}>
                        <Icon type="AntDesign" name="plus" color="white" size={RFPercentage(2.5)} />
                        <TextLato style={{color: 'white', fontSize: RFPercentage(1.5)}}>Add Image</TextLato>
                    </TouchableOpacity>
                </ScrollView>

                {/* CATEGORIES */}
                <TextLato style={styles.label}>Pick Category</TextLato>
                <ScrollView horizontal contentContainerStyle={styles.categories}>
                    {categories.map(category => {
                        return(
                        <TouchableOpacity
                            key={category._id}
                            activeOpacity={0.7}
                            style={{...styles.category, backgroundColor: pickedCategory === category._id ? gStyles.color_0 : gStyles.color_3}}
                            onPress={() => setPickedCategory(category._id)}
                        >
                            <Image source={{uri: category.image}} style={{marginBottom: height * 0.01, width: RFPercentage(5), aspectRatio: 1, tintColor: 'white'}} />
                            <TextLato style={{textAlign: 'center', color: 'white', fontSize: RFPercentage(1.6), width: '80%'}}>{category.name.en}</TextLato>
                        </TouchableOpacity>)
                    })}
                </ScrollView>
                
                {/* SUBCATEGORIES */}
                <TextLato style={styles.label}>Pick Subcategory</TextLato>
                {pickedCategory === '' ? <View style={{marginHorizontal: 20, height: width * 0.35, justifyContent: 'center', alignItems: 'center', borderColor: gStyles.color_3, borderWidth: 1, borderRadius: 3}}>
                    <TextLato>Please Pick a Category</TextLato></View> : 
                    <ScrollView horizontal style={styles.categories}>
                    {subcategories.map(subcategory => {
                            return(
                            <TouchableOpacity
                                key={subcategory._id}
                                activeOpacity={0.7}
                                style={{...styles.category, backgroundColor: pickedSubcategory === subcategory._id ? gStyles.color_0 : gStyles.color_3}} 
                                onPress={() => setPickedSubcategory(subcategory._id)}
                            >
                                <Image source={{uri: subcategory.image}} style={{marginBottom: height * 0.01, width: RFPercentage(5), aspectRatio: 1, tintColor: 'white'}} />
                                <TextLato style={{textAlign: 'center', color: 'white', fontSize: RFPercentage(1.6), width: '80%'}}>{subcategory.name.en}</TextLato>
                            </TouchableOpacity>)
                    })}
                    </ScrollView>
                    }
                
                {/* FILTER */}
                <TextLato style={styles.label}>Pick Filter</TextLato>
                {pickedSubcategory === '' ? <View style={{marginHorizontal: 20, height: width * 0.35, justifyContent: 'center', alignItems: 'center', borderColor: gStyles.color_3, borderWidth: 1, borderRadius: 3}}>
                    <TextLato>Please Pick a Subcategory</TextLato></View> : 
                <ScrollView horizontal style={styles.categories}>
                {filters.map(filter => {
                        return(
                        <TouchableOpacity
                            key={filter._id}
                            activeOpacity={0.7}
                            style={{...styles.category, backgroundColor: pickedFilter === filter._id ? gStyles.color_0 : gStyles.color_3}} 
                            onPress={() => setPickedFilter(filter._id)}
                        >
                            <TextLato style={{textAlign: 'center', color: 'white', fontSize: RFPercentage(1.6), width: '80%'}}>{filter.name.en}</TextLato>
                        </TouchableOpacity>)
                })}
                </ScrollView>
                }

                 {/* CHECKS */}
                 <View style={{flexDirection: 'row', marginHorizontal: 20, alignItems: 'center', marginTop: height * 0.02}}>
                    <TextLato bold style={{width: '80%'}}>Require the user to input text</TextLato>
                    <Switch
                        trackColor={{ false: '#ccc', true: gStyles.color_2 }}
                        thumbColor={'#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={() => setExtraText(extra => !extra)}
                        value={extraText}
                    />
                 </View>
                 <View style={{flexDirection: 'row', marginHorizontal: 20, alignItems: 'center', marginTop: height * 0.02}}>
                    <TextLato bold style={{width: '80%'}}>Require the user to add an image</TextLato>
                    <Switch
                        trackColor={{ false: '#ccc', true: gStyles.color_2 }}
                        thumbColor={'#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={() => setExtraImage(extra => !extra)}
                        value={extraImage}
                    />
                 </View>

                 {/* DISCOUNT */}
                 <View style={{ marginHorizontal: 20, flexDirection: 'row', alignItems: 'center'}}>
                     <TextLato style={{fontSize: RFPercentage(3), marginRight: en ? width * 0.05 : 0, marginLeft: en ? 0 : width * 0.05}}>Discount</TextLato>
                    <TextInput bold placeholder={'0'} value={discount} onChangeText={input => {
                        const num = (Number(input));
                        if(num && num >= 0 && num < 100) setDiscount(num.toFixed(2) + '');
                    }}
                    style={{fontSize: RFPercentage(3), borderBottomColor: gStyles.color_2, borderBottomWidth: 1, textAlign: 'center',  paddingVertical: height * 0.01}}
                    />
                    <TextLato bold style={{fontSize: RFPercentage(2)}}>%</TextLato>
                 </View>
                
                <TouchableOpacity 
                    onPress={() => checkNotEmpty() ? submitProduct() : null}
                    style={{...styles.submitButton, backgroundColor: checkNotEmpty() ? gStyles.color_0 : gStyles.color_3 }}
                >
                    <TextLato bold style={{color: 'white', fontSize: RFPercentage(2)}}>UPDATE</TextLato>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

const ImageContainer = ({image, children, style}) => {
    const [aspectRatio, setAspectRatio] = useState(1);
    useEffect(() => {
        Image.getSize(image.uri, (width, height) => setAspectRatio(width/height))
    }, [])
    return (
        <ImageBackground source={{uri: image.uri}} style={{...style, aspectRatio}}>
            {children}
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: gStyles.background
    },
    backContainer: {
        marginVertical: 20,
        marginHorizontal: 10

    },
    inputContainer: {
        marginTop: height * 0.05
    },
    label: {
        fontSize: RFPercentage(2),
        marginBottom: height * 0.02,
        marginHorizontal: 20
    },
    categories: {
        flexDirection: 'row',
        marginBottom: height * 0.02,
        paddingHorizontal: 15,
    },
    category: {
        width: width * 0.25,
        height: width * 0.35,
        backgroundColor: gStyles.color_3,
        marginHorizontal: 3,
        borderRadius: 3,
        justifyContent: 'center',
        alignItems: 'center'
    },
    imageContainer: {
        height: width * 0.35,
        backgroundColor: gStyles.color_0,
        alignItems: 'flex-end',
        padding: 5,
        marginRight: 5
    },
    addImageContainer: {
        width: width * 0.25,
        height: width * 0.35,
        backgroundColor: gStyles.color_0,
        alignItems: 'center',
        justifyContent:'center', 
        marginRight: 20
    },
    trashContainer: {
        backgroundColor: gStyles.color_0,
        borderRadius: 100,
        width: 35,
        height: 35,
        justifyContent: 'center',
        alignItems: 'center'
    },
    submitButton: {
        margin: 20,
        backgroundColor: gStyles.color_0,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    }
})

const TextErrorInput = (props) => {
    return (
        <View style={inputStyles.container}>
            <TextLato bold style={inputStyles.label}>{props.title}</TextLato>
            <TextInput placeholder={props.placeholder} style={inputStyles.input} {...props} onChangeText={props.setValue} />
            {props.error !== "" && <TextLato italic style={inputStyles.error}>{props.error}</TextLato>}
        </View>
    )
}

const inputStyles = StyleSheet.create({
    container: {
        width: '100%',
        marginBottom: height * 0.02
    },
    label: {
        fontSize: RFPercentage(2),
        marginBottom: height * 0.01
    },
    input: {
        fontFamily: 'Cairo',
        fontSize: RFPercentage(2),
        width: '100%',
        minHeight: 35,
        color: 'black',
        borderColor: gStyles.color_3,
        borderBottomWidth: 1,
        marginBottom: height * 0.005
    },
    error: {
        fontSize: RFPercentage(1.6),
        color: gStyles.color_1
    }
})

const Specification = ({titleEn, setSpecfications, index}) => {

    return (
        <View style={{margin: 20, borderRadius: 10}}>
            <TextErrorInput 
                value={titleEn} 
                setValue={(title) => setSpecfications(specifications => {
                    specifications[index].titleEn += title;
                    return specifications;
                })} 
                title={'English Specification Title'} 
                placeholder={'Weight, Color, Dimensions'} />
        </View>
    )
}

export default StoreProductsAdd;