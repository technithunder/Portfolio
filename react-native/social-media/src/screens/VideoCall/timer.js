import React, { useEffect, useState } from 'react';
import { Text } from 'react-native'
import { FONTS, wp } from '../../helper/constants';

export const Timer = ({ seconds, endCall, showPopup }) => {
    // initialize timeLeft with the seconds prop
    const [timeLeft, setTimeLeft] = useState(seconds);

    useEffect(() => {
        if (timeLeft == 11) {
            showPopup()
        }

        if (timeLeft == 1) {
            endCall()
        }
        if (!timeLeft) return;

        // save intervalId to clear the interval when the
        // component re-renders
        const intervalId = setInterval(() => {
            setTimeLeft(timeLeft - 1);
        }, 1000);

        // clear interval on re-render to avoid memory leaks
        return () => clearInterval(intervalId);
        // add timeLeft as a dependency to re-rerun the effect
        // when we update it
    }, [timeLeft]);

    return <Text style={{
        fontSize: 22,
        marginLeft: 10,
        color: '#fff',
        fontFamily: FONTS.BOOK
    }}>{timeLeft}s left</Text>
};