import {StyleSheet} from 'react-native';
import {FONTS} from '../../config/font';
import {COLORS} from '../../config/colors';

const styles = StyleSheet.create({
  header: {
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  txtApplications: {
    fontFamily: FONTS.INTER_EXTRA_BOLD,
    fontSize: 24,
    color: '#1A1A1A',
  },
  divider: {
    backgroundColor: '#E6E6E6',
    height: 1,
    marginTop: 12,
  },
  headerSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 24,
    fontFamily: FONTS.INTER_REGULAR,
  },
  benefitsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingVertical: 20,
    marginBottom: 10,
  },
  benefitItem: {
    alignItems: 'center',
    flex: 1,
  },
  benefitIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  benefitText: {
    fontSize: 12,
    fontFamily: FONTS.INTER_MEDIUM,
    color: '#555',
    textAlign: 'center',
  },
  
  // Enhanced Country Selection Styles
  countrySection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    color: '#1A1A1A',
    marginBottom: 8,
    fontFamily: FONTS.INTER_BOLD,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    fontFamily: FONTS.INTER_REGULAR,
    lineHeight: 20,
  },
  countryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  countryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    padding: 20,
    minHeight: 140,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  selectedCountryCard: {
    borderWidth: 2,
    backgroundColor: '#FAFBFF',
    shadowColor: '#4285F4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  countryCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  countryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  countryIcon: {
    fontSize: 24,
  },
  selectedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  countryCardContent: {
    flex: 1,
  },
  countryCardTitle: {
    fontSize: 16,
    fontFamily: FONTS.INTER_BOLD,
    color: '#1A1A1A',
    marginBottom: 4,
  },
  countryCardSubtitle: {
    fontSize: 13,
    fontFamily: FONTS.INTER_MEDIUM,
    color: '#666',
    marginBottom: 8,
  },
  countryCardDescription: {
    fontSize: 12,
    fontFamily: FONTS.INTER_REGULAR,
    color: '#888',
    lineHeight: 16,
  },
  countryCardStats: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  countryCardStatsText: {
    fontSize: 11,
    fontFamily: FONTS.INTER_MEDIUM,
    color: '#4285F4',
    textAlign: 'center',
  },

  // Age Group Styles
  ageGroupSection: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  ageGroupContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  ageGroupButton: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  selectedAgeGroup: {
    backgroundColor: COLORS.APP_PRIMARY_MAIN || '#4285F4',
    borderColor: COLORS.APP_PRIMARY_MAIN || '#4285F4',
  },
  ageGroupText: {
    fontSize: 13,
    color: '#666',
    fontFamily: FONTS.INTER_MEDIUM,
    textAlign: 'center',
  },
  selectedAgeGroupText: {
    color: '#FFFFFF',
    fontFamily: FONTS.INTER_BOLD,
  },

  // Duration Styles
  durationSection: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  durationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  durationButton: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  selectedDuration: {
    backgroundColor: COLORS.APP_PRIMARY_MAIN || '#4285F4',
    borderColor: COLORS.APP_PRIMARY_MAIN || '#4285F4',
  },
  durationText: {
    fontSize: 14,
    color: '#666',
    fontFamily: FONTS.INTER_MEDIUM,
  },
  selectedDurationText: {
    color: '#FFFFFF',
    fontFamily: FONTS.INTER_BOLD,
  },

  // Plans Section
  plansSection: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  plansSectionHeader: {
    marginBottom: 20,
  },
  plansCounter: {
    backgroundColor: '#F0F8FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  plansCounterText: {
    fontSize: 12,
    color: '#4285F4',
    fontFamily: FONTS.INTER_MEDIUM,
  },

  // Plan Card Styles
  planCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    // elevation: 1,
  },
  selectedPlan: {
    borderColor: COLORS.APP_PRIMARY_MAIN || '#4285F4',
    shadowColor: COLORS.APP_PRIMARY_MAIN || '#4285F4',
    shadowOpacity: 0.2,
  },
  popularBadge: {
    position: 'absolute',
    top: -8,
    right: 20,
    backgroundColor: '#FF6B35',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  popularText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontFamily: FONTS.INTER_BOLD,
  },
  planHeader: {
    marginBottom: 16,
  },
  companyInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  companyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  companyLogo: {
    fontSize: 22,
    marginRight: 12,
  },
  companyName: {
    fontSize: 16,
    fontFamily: FONTS.INTER_BOLD,
    color: '#1A1A1A',
    marginBottom: 2,
  },
  planName: {
    fontSize: 14,
    color: '#666',
    fontFamily: FONTS.INTER_MEDIUM,
  },
  ratingContainer: {
    alignItems: 'flex-end',
  },
  rating: {
    fontSize: 14,
    color: '#FF8C00',
    fontFamily: FONTS.INTER_BOLD,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'flex-end',
  },
  currency: {
    fontSize: 16,
    color: '#666',
    fontFamily: FONTS.INTER_MEDIUM,
  },
  price: {
    fontSize: 28,
    fontFamily: FONTS.INTER_BOLD,
    color: '#1A1A1A',
  },
  period: {
    fontSize: 14,
    color: '#666',
    fontFamily: FONTS.INTER_MEDIUM,
  },
  coverageContainer: {
    marginBottom: 12,
  },
  coverageLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
    fontFamily: FONTS.INTER_REGULAR,
  },
  coverageAmount: {
    fontSize: 20,
    fontFamily: FONTS.INTER_BOLD,
    color: '#007AFF',
  },
  regionContainer: {
    marginBottom: 16,
    backgroundColor: 'rgba(255,255,255,0.6)',
    padding: 10,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#4285F4',
  },
  regionLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    fontFamily: FONTS.INTER_MEDIUM,
  },
  regionText: {
    fontSize: 13,
    color: '#333',
    fontFamily: FONTS.INTER_REGULAR,
    lineHeight: 18,
  },
  featuresContainer: {
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    paddingRight: 10,
  },
  checkmark: {
    color: '#4CAF50',
    fontSize: 16,
    marginRight: 10,
    fontWeight: 'bold',
    marginTop: 1,
  },
  featureText: {
    fontSize: 13,
    color: '#555',
    fontFamily: FONTS.INTER_REGULAR,
    flex: 1,
    lineHeight: 18,
  },
  moreFeatures: {
    fontSize: 12,
    color: '#4285F4',
    fontFamily: FONTS.INTER_MEDIUM,
    marginTop: 4,
    textAlign: 'center',
  },
  selectedIndicator: {
    backgroundColor: COLORS.APP_PRIMARY_MAIN || '#4285F4',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  selectedText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: FONTS.INTER_BOLD,
  },

  // No Plans Styles
  noPlansContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    marginVertical: 20,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  noPlansIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  noPlansTitle: {
    fontSize: 18,
    fontFamily: FONTS.INTER_BOLD,
    color: '#333',
    marginBottom: 8,
  },
  noPlansText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontFamily: FONTS.INTER_REGULAR,
    lineHeight: 20,
  },

  // Scroll Content
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  scrollContentWithButton: {
    flexGrow: 1,
    paddingBottom: 180,
  },

  // Summary Section
  summarySection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  summaryPlanName: {
    fontSize: 16,
    fontFamily: FONTS.INTER_BOLD,
    color: '#1A1A1A',
    flex: 1,
    marginRight: 10,
  },
  summaryPlanRating: {
    fontSize: 14,
    color: '#FF8C00',
    fontFamily: FONTS.INTER_BOLD,
  },
  summaryDetails: {
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
    fontFamily: FONTS.INTER_REGULAR,
  },
  summaryValue: {
    fontSize: 14,
    color: '#333',
    fontFamily: FONTS.INTER_MEDIUM,
    textAlign: 'right',
    flex: 1,
    marginLeft: 20,
  },
  summaryTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 2,
    borderTopColor: '#E0E0E0',
  },
  totalLabel: {
    fontSize: 18,
    fontFamily: FONTS.INTER_BOLD,
    color: '#1A1A1A',
  },
  totalValue: {
    fontSize: 24,
    fontFamily: FONTS.INTER_BOLD,
    color: '#4285F4',
  },

  // Bottom Section
  bottomSection: {
    position: 'absolute',
    bottom: 70,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  purchaseButton: {
    backgroundColor: '#4285F4',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#4285F4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  purchaseButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: FONTS.INTER_BOLD,
  },
});

export default styles;