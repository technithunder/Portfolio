import {View} from 'react-native';
import React, {FC} from 'react';
import {OrderCardProps} from '../../orders/types';
import styles from './styles';
import {colors, commonSty} from '../../../theme';
import {Typography} from '../../../components';
import {Fonts} from '../../../constants';
import {moderateScale} from 'react-native-size-matters';

const ProductDetailCard: FC<OrderCardProps> = props => {
  const {order} = props;
  
  // Calculate subtotal from all order items
  const calculateSubtotal = () => {
    return order?.orderItems?.reduce((total, item) => total + item.totalPrice, 0) || 0;
  };
  
  const subtotal = calculateSubtotal();
  const shipping = 0; // Assuming free shipping
  const tax = 0; // Add tax calculation if needed
  
  return (
    <View style={[styles.orderDetailContainer, styles.productDetailContainer]}>
      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <Typography 
          title="Order Items" 
          font={Fonts.SemiBold} 
          size={18} 
          color={colors.slateGrey}
        />
        <View style={styles.headerLine} />
      </View>
      
      {/* Items Container */}
      <View style={styles.itemsContainer}>
        {order?.orderItems?.map((item, index) => (
          <View 
            key={item.id || index} 
            style={[
              styles.productItemContainer,
              index === order.orderItems.length - 1 && styles.lastItem
            ]}
          >
            {/* Item Header */}
            <View style={styles.itemHeader}>
              <View style={styles.productNameContainer}>
                <Typography
                  title={item.productName}
                  font={Fonts.SemiBold}
                  size={16}
                  numberOfLines={2}
                />
                <View style={styles.unitPriceContainer}>
                  <Typography
                    title={`Unit Price: ₹${item.unitPrice?.toFixed(2)}`}
                    font={Fonts.Medium}
                    size={13}
                    color={colors.osloGrey}
                  />
                </View>
              </View>
              
              <View style={styles.productPriceContainer}>
                <View style={styles.quantityBadge}>
                  <Typography 
                    title={`×${item.quantity}`} 
                    font={Fonts.SemiBold} 
                    size={12} 
                    color={colors.white}
                  />
                </View>
                <Typography 
                  title={`₹${item.totalPrice?.toFixed(2)}`} 
                  font={Fonts.Bold} 
                  size={17} 
                  color={colors.slateGrey}
                />
              </View>
            </View>
            
            {/* Product Specifications */}
            {(item.ledcolors || item.bodycolors || item.watts || item.reflectors) && (
              <View style={styles.productSpecsContainer}>
                <Typography 
                  title="Specifications:" 
                  font={Fonts.Medium} 
                  size={13}
                  color={colors.slateGrey}
                  style={{marginBottom: moderateScale(8)}}
                />
                <View style={styles.specsGrid}>
                  {item.ledcolors && (
                    <View style={styles.specItem}>
                      <View style={[styles.specDot, {backgroundColor: '#E74C3C'}]} />
                      <Typography 
                        title={`LED: ${item.ledcolors}`} 
                        font={Fonts.Medium} 
                        size={12}
                        color={colors.osloGrey}
                      />
                    </View>
                  )}
                  {item.bodycolors && (
                    <View style={styles.specItem}>
                      <View style={[styles.specDot, {backgroundColor: '#3498DB'}]} />
                      <Typography 
                        title={`Body: ${item.bodycolors}`} 
                        font={Fonts.Medium} 
                        size={12}
                        color={colors.osloGrey}
                      />
                    </View>
                  )}
                  {item.watts && (
                    <View style={styles.specItem}>
                      <View style={[styles.specDot, {backgroundColor: '#F39C12'}]} />
                      <Typography 
                        title={`${item.watts}W`} 
                        font={Fonts.Medium} 
                        size={12}
                        color={colors.osloGrey}
                      />
                    </View>
                  )}
                  {item.reflectors && (
                    <View style={styles.specItem}>
                      <View style={[styles.specDot, {backgroundColor: '#9B59B6'}]} />
                      <Typography 
                        title={`Reflectors: ${item.reflectors}`} 
                        font={Fonts.Medium} 
                        size={12}
                        color={colors.osloGrey}
                      />
                    </View>
                  )}
                </View>
              </View>
            )}
          </View>
        ))}
      </View>

      {/* Pricing Summary */}
      <View style={styles.pricingSummary}>
        <View style={styles.summaryHeader}>
          <Typography
            title="Order Summary"
            font={Fonts.SemiBold}
            size={16}
            color={colors.slateGrey}
          />
        </View>
        
        <View style={styles.pricingSection}>
          <View style={styles.priceRow}>
            <Typography
              title="Subtotal"
              font={Fonts.Medium}
              size={14}
              color={colors.osloGrey}
            />
            <Typography 
              title={`₹${subtotal.toFixed(2)}`} 
              font={Fonts.SemiBold} 
              size={14} 
              color={colors.slateGrey}
            />
          </View>
          
          <View style={styles.priceRow}>
            <Typography
              title="Shipping & Handling"
              font={Fonts.Medium}
              size={14}
              color={colors.osloGrey}
            />
            <View style={styles.shippingContainer}>
              {shipping === 0 ? (
                <View style={styles.freeBadge}>
                  <Typography 
                    title="FREE" 
                    font={Fonts.Bold} 
                    size={11} 
                  />
                </View>
              ) : (
                <Typography 
                  title={`₹${shipping.toFixed(2)}`} 
                  font={Fonts.SemiBold} 
                  size={14} 
                />
              )}
            </View>
          </View>
          
          {tax > 0 && (
            <View style={styles.priceRow}>
              <Typography
                title="Tax"
                font={Fonts.Medium}
                size={14}
                color={colors.osloGrey}
              />
              <Typography 
                title={`₹${tax.toFixed(2)}`} 
                font={Fonts.SemiBold} 
                size={14} 
                color={colors.slateGrey}
              />
            </View>
          )}
          
          <View style={styles.totalRow}>
            <Typography
              title="Total Amount"
              font={Fonts.Bold}
              size={16}
              color={colors.slateGrey}
            />
            <Typography 
              title={`₹${order?.totalAmount?.toFixed(2) || '0.00'}`} 
              font={Fonts.Bold} 
              size={18} 
              color={colors.slateGrey}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default ProductDetailCard;