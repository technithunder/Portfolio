import React, { useEffect, useState } from 'react';
import { Text } from 'react-native'
import { FONTS } from '../../helper/constants';

export const Timer10 = ({ seconds, onVideoEnable }) => {
    // initialize timeLeft with the seconds prop
    const [timeLeft, setTimeLeft] = useState(seconds);

    useEffect(() => {
        // exit early when we reach 0
        if (timeLeft == 1) {
            onVideoEnable()
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
        fontSize: 24,
        marginLeft: 10,
        color: 'red',
        fontFamily: FONTS._BOLD
    }}>{timeLeft}</Text>
};