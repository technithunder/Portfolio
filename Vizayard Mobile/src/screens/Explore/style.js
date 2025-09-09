import {Dimensions, StyleSheet} from 'react-native';
import {FONTS} from '../../config/font';
import {COLORS} from '../../config/colors';

const {width} = Dimensions.get('window');
const itemSize = (width - 80) / 2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.APP_COMMON_WHITE,
  },
  txtProfile: {
    fontFamily: FONTS.INTER_BOLD,
    color: COLORS.APP_BLACK,
    fontSize: 22,
    marginBlock:12,
    marginHorizontal:16
  },
  header: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBlock: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.APP_GRAY_100,
  },
  txtExplore: {
    fontFamily: FONTS.INTER_EXTRA_BOLD,
    fontSize: 24,
  },
  txtTrendingNow: {
    fontFamily: FONTS.INTER_SEMIBOLD,
    fontSize: 20,
  },
  videoGrid: {
    paddingHorizontal: 12,
    paddingBottom: 20,
    marginTop: 16,
  },
  videoGridItem: {
    width: itemSize,
    height: itemSize * 1.4,
    margin: 8,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#eee',
    position: 'relative',
    marginBottom: 100,
  },
  videoThumbnail: {
    width: '100%',
    height: '100%',
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  errorOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(240,240,240,0.8)',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  trendingNowContainerList: {
    marginBottom: 10,
  },
  trendingBorder: {
    height: 1,
    backgroundColor: COLORS.APP_GRAY_100,
    marginTop: 20,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    zIndex: 0,
  },
});

export default styles;
