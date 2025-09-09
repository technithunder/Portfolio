import React, { useEffect, useRef } from "react";
import { Modal, View, ActivityIndicator, StyleSheet, Animated, Image } from "react-native";
import SUCCESS_ICON from '../../../../assets/images/success_icon.png'
import { COLORS } from "../../../config/colors";
import { Text } from "react-native-gesture-handler";
import { FONTS } from "../../../config/font";

const LoaderModal = ({ loading, isSuccess, isModal }) => {
    useEffect(() => {
        if (isSuccess) {
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }).start();
        } else {
            scaleAnim.setValue(0);
        }
    }, [isSuccess]);

    const scaleAnim = useRef(new Animated.Value(0)).current;
    return (
        <Modal transparent={true} visible={isModal} animationType="fade">
            <View style={styles.modalContainer}>
                <View style={styles.loaderContainer}>
                    <Text style={styles.txtQualityText}>{loading ? "Performing quality checks on" : "Quality checks passed"}</Text>
                    <View style={{ marginTop: 20 }}>
                        {loading ? <ActivityIndicator size="large" color={COLORS.APP_PRIMARY} /> : (<Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                            <Image style={styles.successIcon} source={SUCCESS_ICON} alt="success_icon" />
                        </Animated.View>)}
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    loaderContainer: {
        width: '80%',
        height: 220,
        backgroundColor: "#fff",
        borderRadius: 10,
        paddingTop: 20,
        alignItems: "center",
    },
    successIcon: {
        height: 120,
        width: 120,
    },
    txtQualityText: {
        color: COLORS.APP_BLACK,
        fontSize: 18,
        fontFamily: FONTS.INTER_SEMIBOLD
    }
});

export default LoaderModal;
