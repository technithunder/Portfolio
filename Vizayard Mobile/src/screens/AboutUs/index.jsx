import React from 'react'
import { View, Text, ScrollView, StyleSheet } from 'react-native'
import { Container } from '../../components'
import { COLORS } from '../../config/colors'

const AboutUs = () => {
  return (
    <Container title='About Us' showBack style={{flex: 1, backgroundColor: COLORS.APP_WHITE}}>
        <View style={styles.divider}/>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Company Introduction */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Who We Are</Text>
          <Text style={styles.bodyText}>
            We are a leading visa consultancy firm dedicated to simplifying the visa application process 
            for travelers worldwide. With over a decade of experience in immigration services, we have 
            successfully helped thousands of clients secure visas for business, tourism, education, and 
            family reunification purposes.
          </Text>
        </View>

        {/* Mission Statement */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Mission</Text>
          <Text style={styles.bodyText}>
            To provide exceptional visa consultation services with transparency, efficiency, and 
            personalized attention. We strive to make international travel accessible by guiding 
            our clients through complex visa procedures with expertise and care.
          </Text>
        </View>

        {/* Services */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Services</Text>
          <View style={styles.servicesList}>
            <Text style={styles.serviceItem}>• Tourist & Business Visa Applications</Text>
            <Text style={styles.serviceItem}>• Student Visa Consultation</Text>
            <Text style={styles.serviceItem}>• Work Permit & Employment Visas</Text>
            <Text style={styles.serviceItem}>• Family Reunion & Spouse Visas</Text>
            <Text style={styles.serviceItem}>• Document Verification & Translation</Text>
            <Text style={styles.serviceItem}>• Interview Preparation & Support</Text>
            <Text style={styles.serviceItem}>• Visa Status Tracking</Text>
          </View>
        </View>

        {/* Why Choose Us */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Why Choose Us</Text>
          <View style={styles.benefitsList}>
            <View style={styles.benefitItem}>
              <Text style={styles.benefitTitle}>Expert Guidance</Text>
              <Text style={styles.benefitDesc}>
                Our certified immigration consultants stay updated with the latest visa regulations 
                and requirements across multiple countries.
              </Text>
            </View>
            
            <View style={styles.benefitItem}>
              <Text style={styles.benefitTitle}>High Success Rate</Text>
              <Text style={styles.benefitDesc}>
                We maintain a 95% visa approval rate through meticulous application preparation 
                and thorough documentation review.
              </Text>
            </View>
            
            <View style={styles.benefitItem}>
              <Text style={styles.benefitTitle}>Personalized Service</Text>
              <Text style={styles.benefitDesc}>
                Each client receives individual attention with customized solutions based on 
                their specific travel needs and circumstances.
              </Text>
            </View>
            
            <View style={styles.benefitItem}>
              <Text style={styles.benefitTitle}>Transparent Pricing</Text>
              <Text style={styles.benefitDesc}>
                No hidden fees or surprise charges. We provide clear, upfront pricing for 
                all our services with detailed cost breakdowns.
              </Text>
            </View>
          </View>
        </View>

        {/* Statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Track Record</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>10,000+</Text>
              <Text style={styles.statLabel}>Successful Applications</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>50+</Text>
              <Text style={styles.statLabel}>Countries Covered</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>95%</Text>
              <Text style={styles.statLabel}>Success Rate</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>24/7</Text>
              <Text style={styles.statLabel}>Customer Support</Text>
            </View>
          </View>
        </View>

        {/* Team */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Team</Text>
          <Text style={styles.bodyText}>
            Our team consists of qualified immigration lawyers, certified consultants, and 
            experienced case managers who work together to ensure your visa application is 
            handled with the utmost professionalism and attention to detail.
          </Text>
        </View>

        {/* Commitment */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Commitment</Text>
          <Text style={styles.bodyText}>
            We are committed to maintaining the highest standards of service quality, 
            confidentiality, and ethical practices. Your trust is our most valuable asset, 
            and we work tirelessly to exceed your expectations at every step of the visa 
            application process.
          </Text>
        </View>

        {/* Contact CTA */}
        <View style={[styles.section, styles.ctaSection]}>
          <Text style={styles.ctaTitle}>Ready to Start Your Journey?</Text>
          <Text style={styles.ctaText}>
            Contact us today for a free consultation and let us help you navigate 
            the visa application process with confidence.
          </Text>
        </View>

      </ScrollView>
    </Container>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  divider:{
    height: 1,
    backgroundColor: COLORS.APP_DIVIDER || '#E6E6E6',
    marginBottom:10
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.APP_PRIMARY_MAIN || '#2E5BFF',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  bodyText: {
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.APP_BLACK || '#333333',
    textAlign: 'justify',
  },
  servicesList: {
    paddingLeft: 10,
  },
  serviceItem: {
    fontSize: 16,
    lineHeight: 22,
    color: COLORS.APP_BLACK || '#333333',
    marginBottom: 6,
  },
  benefitsList: {
    gap: 15,
  },
  benefitItem: {
    backgroundColor: COLORS.LIGHT_GRAY || '#F8F9FA',
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.APP_PRIMARY_MAIN || '#2E5BFF',
  },
  benefitTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.APP_BLACK || '#333333',
    marginBottom: 5,
  },
  benefitDesc: {
    fontSize: 15,
    lineHeight: 20,
    color: COLORS.TEXT_MEDIUM || '#666666',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    backgroundColor: COLORS.APP_PRIMARY_MAIN || '#2E5BFF',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.APP_WHITE || '#FFFFFF',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 13,
    color: COLORS.APP_WHITE || '#FFFFFF',
    textAlign: 'center',
    opacity: 0.9,
  },
  ctaSection: {
    backgroundColor: COLORS.LIGHT_BLUE || '#E3F2FD',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  ctaTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.APP_PRIMARY_MAIN || '#2E5BFF',
    marginBottom: 10,
    textAlign: 'center',
  },
  ctaText: {
    fontSize: 16,
    lineHeight: 22,
    color: COLORS.APP_BLACK || '#333333',
    textAlign: 'center',
  },
})

export default AboutUs