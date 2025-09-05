import streamlit as st
import pandas as pd
import numpy as np
import pickle
import requests

# Load data
similarity = pickle.load(open('similarity.pkl', 'rb'))
electronics = pickle.load(open('data.pkl', 'rb'))

# Recommender function
def recommender(product):
    product_index = electronics[electronics['name'] == product].index[0]
    similarity_list = list(enumerate(similarity[product_index]))
    top_10_similar_product = sorted(similarity_list, key=lambda x: x[1], reverse=True)[1:11]
    
    similar_products = []
    for product_index, similarity_score in top_10_similar_product:
        product_info = {
            'name': electronics.loc[product_index]['name'],
            'image': electronics.loc[product_index]['image'],
            'ratings': electronics.loc[product_index]['ratings'],
            'no_of_ratings': electronics.loc[product_index]['no_of_ratings'],
            'discount_price': electronics.loc[product_index]['discount_price'],
            'actual_price': electronics.loc[product_index]['actual_price']
        }
        similar_products.append(product_info)
    return similar_products

# Check if image is accessible
def is_image_loaded(url):
    try:
        response = requests.get(url)
        return response.status_code == 200
    except:
        return False

# Streamlit UI
st.title('🛍️ Product Search Recommend')

# Sidebar for product selection
product_name = st.sidebar.selectbox('Select a product:', electronics['name'])

# Trigger search
if st.sidebar.button('Search'):
    recommendations = recommender(product_name)
    st.write(f"### 🔎 Top recommendations for: **{product_name}**")

    # Filter only those with working images
    valid_recommendations = [rec for rec in recommendations if is_image_loaded(rec['image'])]

    num_recommendations = len(valid_recommendations)
    num_rows = (num_recommendations + 1) // 2  # For 2 columns layout

    for row in range(num_rows):
        cols = st.columns(2)
        start_index = row * 2
        end_index = min(start_index + 2, num_recommendations)

        for idx in range(start_index, end_index):
            with cols[idx - start_index]:
                st.image(valid_recommendations[idx]['image'], width=150)
                st.write(f"**{valid_recommendations[idx]['name']}**")

                # Display 3 key features
                st.markdown(f"⭐ **Rating:** {valid_recommendations[idx]['ratings']}")
                st.markdown(f"👥 **Rated by:** {valid_recommendations[idx]['no_of_ratings']} users")
                st.markdown(f"💰 **Price:** {valid_recommendations[idx]['discount_price']}  &nbsp;&nbsp; ~~{valid_recommendations[idx]['actual_price']}~~")
