import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import {COLORS} from '../../config/colors';
import {FONTS} from '../../config/font';
import {Typography} from '../../components';
import {Images} from '../../config';

const STATUS_ORDER = ['under-review', 'approved', 'completed', 'rejected'];

const applicationStatusText = {
  'under-review': 'Under Review',
  'processing': 'Processing', 
  'approved': 'Approved',
  'completed': 'Completed',
  'rejected': 'Rejected',
};

const ApplicationProgressBar = ({statusLogs, currentStatus}) => {
  if (!currentStatus || !STATUS_ORDER.includes(currentStatus)) {
    return null;
  }

  const getStatusOrder = () => {
    if (currentStatus === 'rejected') {
      return ['under-review', 'rejected'];
    } else {
      return STATUS_ORDER;
    }
  };

  const statusOrder = getStatusOrder();

  const getCompletedStatuses = () => {
    if (!statusLogs || !Array.isArray(statusLogs)) return new Set();

    const completedStatuses = new Set();
    statusLogs.forEach(log => {
      if (statusOrder.includes(log.status)) {
        completedStatuses.add(log.status);
      }
    });

    return completedStatuses;
  };

  const getStatusDetails = () => {
    if (!statusLogs || !Array.isArray(statusLogs)) return {};

    const statusDetails = {};
    statusLogs.forEach(log => {
      if (statusOrder.includes(log.status)) {
        if (!statusDetails[log.status]) {
          statusDetails[log.status] = {
            changedAt: log.changedAt,
            remarks: log.remarks,
          };
        }
      }
    });

    return statusDetails;
  };

  const completedStatuses = getCompletedStatuses();
  const statusDetails = getStatusDetails();

  const isStatusCompleted = (status) => {
    return completedStatuses.has(status);
  };

  const isStatusActive = (status) => {
    return status === currentStatus;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Typography
          title="Application Status"
          size={18}
          font={FONTS.INTER_BOLD}
        />
        <Image
          source={Images.status}
          style={styles.headerIcon}
        />
      </View>

      {/* Progress Timeline */}
      <View style={styles.timelineContainer}>
        {/* <Typography
          title="Status Timeline"
          size={14}
          font={FONTS.INTER_MEDIUM}
          mb={15}
        /> */}

        {statusOrder.map((status, index) => {
          const isCompleted = isStatusCompleted(status);
          const isActive = isStatusActive(status);
          const isLast = index === statusOrder.length - 1;
          const statusDetail = statusDetails[status];

          return (
            <View key={status} style={styles.timelineItem}>
              {/* Timeline Visual Elements */}
              <View style={styles.timelineVisual}>
                {/* Circle/Dot */}
                <View
                  style={[
                    styles.timelineDot,
                    {
                      backgroundColor: isCompleted 
                        ? COLORS.APP_PRIMARY_MAIN 
                        : (isActive ? COLORS.APP_PRIMARY_MAIN : '#E5E7EB'),
                      borderColor: isCompleted || isActive 
                        ? COLORS.APP_PRIMARY_MAIN 
                        : '#E5E7EB',
                    },
                  ]}>
                  {/* Checkmark for completed status */}
                  {isCompleted && (
                    <View style={styles.checkmark}>
                      <Text style={styles.checkmarkText}>✓</Text>
                    </View>
                  )}
                </View>

                {/* Connecting Line */}
                {!isLast && (
                  <View
                    style={[
                      styles.timelineLine,
                      {
                        backgroundColor: isCompleted 
                          ? COLORS.APP_PRIMARY_MAIN 
                          : '#E5E7EB',
                      },
                    ]}
                  />
                )}
              </View>

              {/* Content */}
              <View style={styles.timelineContent}>
                <Typography
                  title={applicationStatusText[status]}
                  size={14}
                  font={
                    isCompleted || isActive
                      ? FONTS.INTER_SEMIBOLD
                      : FONTS.INTER_REGULAR
                  }
                  color={
                    isCompleted 
                      ? COLORS.APP_PRIMARY_MAIN 
                      : (isActive ? COLORS.APP_PRIMARY_MAIN : '#6B7280')
                  }
                  mb={4}
                />

                {/* Date and Remarks */}
                {isCompleted && statusDetail ? (
                  <View>
                    <Typography
                      title={new Date(statusDetail.changedAt).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                      size={12}
                      color="#6B7280"
                      font={FONTS.INTER_REGULAR}
                    />
                    {statusDetail.remarks && (
                      <Typography
                        title={`Note: ${statusDetail.remarks}`}
                        size={11}
                        color="#9CA3AF"
                        mt={4}
                        font={FONTS.INTER_REGULAR}
                      />
                    )}
                  </View>
                ) : (
                  <Typography
                    title={isActive ? "In Progress" : "Pending"}
                    size={12}
                    color="#9CA3AF"
                    font={FONTS.INTER_REGULAR}
                  />
                )}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.APP_WHITE,
    elevation: 2,
    borderRadius: moderateScale(12),
    padding: moderateScale(16),
    marginHorizontal: moderateScale(15),
    marginTop: moderateScale(20),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: moderateScale(20),
  },

  headerIcon: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
    tintColor: COLORS.APP_PRIMARY_MAIN,
  },

  timelineContainer: {
    paddingLeft: moderateScale(4),
  },

  timelineItem: {
    flexDirection: 'row',
    // marginBottom: moderateScale(12),
    minHeight: moderateScale(60),
  },

  timelineVisual: {
    alignItems: 'center',
    marginRight: moderateScale(16),
    width: moderateScale(20),
  },

  timelineDot: {
    width: moderateScale(24),
    height: moderateScale(24),
    borderRadius: moderateScale(50),
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    zIndex: 2,
  },

  checkmark: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },

  checkmarkText: {
    color: COLORS.APP_WHITE,
    fontSize: moderateScale(12),
    fontWeight: 'bold',
    textAlign: 'center',
  },

  timelineLine: {
    width: moderateScale(3),
    height: moderateScale(40),
    marginTop: moderateScale(2),
    borderRadius: moderateScale(1.5),
  },

  timelineContent: {
    flex: 1,
    paddingTop: moderateScale(-2),
    justifyContent: 'flex-start',
  },
});

export default ApplicationProgressBar;