import React, { useEffect, useState } from 'react'
import { FlatList, Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native'
//import icons
import Ionicons from 'react-native-vector-icons/Ionicons';
//relative path imports
import styles from './style'
import { COLORS } from '../../config/colors'
import { getAllVisaApplications } from '../../api';


const VisaApplications = ({ navigation }) => {
    const [data, setData] = useState([])


    useEffect(() => {
        fetchAllVisaApplications()
    }, [])

    const fetchAllVisaApplications = async () => {
        try {
            const response = await getAllVisaApplications()
            setData(response?.data?.data?.visaApplications)
        } catch (e) {
            console.log(e)
        }
    }

    const renderItem = ({ item }) => {
        return (
            <View style={[styles.animatedCard, { overflow: 'hidden', marginBottom: 16 }]}>
                <View style={{ width: "100%", paddingHorizontal: 10, paddingVertical: 10, flexDirection: 'row', gap: 30 }}>
                    <View style={{ width: "20%" }}>
                        <Image source={{ uri: item.photo }} style={{ width: 70, height: 70, borderRadius: 10 }} />
                    </View>
                    <View style={{ width: "80%" }}>
                        <Text style={styles.details}>{item?.details?.firstName}</Text>
                        <Text style={styles.details}>{item?.details?.gender}</Text>
                        <Text style={styles.details}>{item?.details?.passportNumber}</Text>
                    </View>
                </View>
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="chevron-back" size={24} color={COLORS.APP_BLACK} />
                </TouchableOpacity>
                <Text style={styles.txtMyApplications}>My Applications</Text>
            </View>
            <View style={{ marginTop: 20 }}>
                <FlatList
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    showsVerticalScrollIndicator={false}
                    style={{ marginTop: 24, marginHorizontal: 20 }}
                />
            </View>
        </SafeAreaView>
    )
}

export default VisaApplications