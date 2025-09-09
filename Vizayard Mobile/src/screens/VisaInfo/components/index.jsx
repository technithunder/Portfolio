import React, {useRef} from 'react';
import {ScrollView, View, StyleSheet, useWindowDimensions} from 'react-native';
import RenderHTML from 'react-native-render-html';
import {COLORS} from '../../../config/colors';
import {FONTS} from '../../../config/font';

const ProcessFlow = ({data}) => {
  const scrollViewRef = useRef(null);
  const {width} = useWindowDimensions();

  const handleContentSizeChange = () => {
    scrollViewRef.current?.scrollToEnd({animated: true});
  };

  const renderTimelineItem = (item, index) => {
    const isFirst = index === 0;
    const isLast = index === data.length - 1;

    return (
      <View key={index} style={styles.timelineItem}>
        <View style={styles.timelineLeftColumn}>
          {!isFirst && <View style={styles.topLine} />}

          <View style={styles.circleContainer}>
            <View style={styles.outerCircle}>
              <View style={styles.innerCircle} />
            </View>
          </View>

          {!isLast && <View style={styles.bottomLine} />}
        </View>

        <View style={[styles.contentContainer, {width: width - 80}]}>
          <RenderHTML
            contentWidth={width - 80}
            source={{html: item?.title || ''}}
            baseStyle={styles.contentText}
          />
        </View>
      </View>
    );
  };

  return (
    <ScrollView
      ref={scrollViewRef}
      onContentSizeChange={handleContentSizeChange}
      style={styles.scrollView}
      showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        {data?.map((item, index) => renderTimelineItem(item, index))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  timelineItem: {
    flexDirection: 'row',
    position: 'relative',
    minHeight: 30, // Minimum height ensure karne ke liye
  },
  timelineLeftColumn: {
    width: 30,
    alignItems: 'center',
    position: 'relative',
    height: '100%',
  },
  topLine: {
    width: 2,
    height: 20,
    backgroundColor: COLORS.APP_PRIMARY_MAIN,
    position: 'absolute',
    top: 0,
  },
  bottomLine: {
    width: 2,
    flex: 1,
    backgroundColor: COLORS.APP_PRIMARY_MAIN,
    position: 'absolute',
    top: 20,
    bottom: -25,
  },
  circleContainer: {
    position: 'relative',
    zIndex: 10,
    marginTop: 15,
  },
  outerCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.APP_PRIMARY_MAIN,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.APP_PRIMARY_MAIN,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  innerCircle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    flex: 1,
    marginLeft: 12,
  },
  contentText: {
    fontSize: 12,
    color: '#333333',
    lineHeight: 20,
    fontFamily: FONTS.INTER_MEDIUM,
  },
});

export default ProcessFlow;
