import React, { useEffect, useRef, useState } from 'react'
import { Text, ScrollView, StyleSheet, Animated, Image } from 'react-native'
import SUCCESS_ICON from "../../../../assets/images/success_icon.png"
//relative path imports
import StyledButton from '../../../components/StyledButton'
import BottomDrawer from '../../../components/BottomDrawer'

const Checkout = ({ navigation }) => {
    const [visible, setVisible] = useState(false);
    const scaleAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }).start();
        } else {
            scaleAnim.setValue(0);
        }
    }, [visible]);

    const makePaymentBtn = () => {
        setVisible(true);
        setTimeout(() => {
            navigation.navigate('Bottom');
            setVisible(false);
        }, 300);
    };

    return (
        <>
            <ScrollView contentContainerStyle={{ marginTop: 20, paddingBottom: 100, marginHorizontal: 20 }}>
                <StyledButton title='Make Payment' style={{ marginTop: 40 }} onPress={makePaymentBtn} />
            </ScrollView>

            <BottomDrawer visible={visible} onClose={() => setVisible(false)} height={200} duration={400}>
                <Text style={styles.drawerTitle}>Payment Successful</Text>
                <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                    <Image style={styles.successIcon} source={SUCCESS_ICON} alt="success_icon" />
                </Animated.View>
            </BottomDrawer>
        </>
    )
}

const styles = StyleSheet.create({
    drawerTitle: {
        fontSize: 24,
        fontWeight: 500,
        marginTop: 40,
    },
    successIcon: {
        height: 120,
        width: 120,
        marginBlock: 60,
    },
})

export default Checkout