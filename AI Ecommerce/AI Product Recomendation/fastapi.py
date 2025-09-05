from fastapi import FastAPI, HTTPException
from typing import List
import pandas as pd
import pickle
import requests

app = FastAPI()

# Load data
try:
    similarity = pickle.load(open('similarity.pkl', 'rb'))
    electronics = pickle.load(open('data.pkl', 'rb'))
except Exception as e:
    raise RuntimeError("Failed to load pickle files: " + str(e))

# Image URL checker
def is_image_loaded(url: str) -> bool:
    try:
        response = requests.get(url, timeout=5)
        return response.status_code == 200
    except:
        return False

# Recommendation logic
def recommender(product: str) -> List[dict]:
    if product not in electronics['name'].values:
        raise ValueError("Product not found")

    product_index = electronics[electronics['name'] == product].index[0]
    similarity_list = list(enumerate(similarity[product_index]))
    top_10_similar_product = sorted(similarity_list, key=lambda x: x[1], reverse=True)[1:11]

    similar_products = []
    for idx, _ in top_10_similar_product:
        product_data = electronics.loc[idx]
        if is_image_loaded(product_data['image']):
            similar_products.append({
                'name': product_data['name'],
                'image': product_data['image'],
                'ratings': product_data['ratings'],
                'no_of_ratings': product_data['no_of_ratings'],
                'discount_price': product_data['discount_price'],
                'actual_price': product_data['actual_price']
            })

    return similar_products

# API Endpoint
@app.get("/recommend/{product_name}")
def get_recommendations(product_name: str):
    try:
        recommendations = recommender(product_name)
        if not recommendations:
            raise HTTPException(status_code=404, detail="No valid recommendations found")
        return {"product": product_name, "recommendations": recommendations}
    except ValueError as ve:
        raise HTTPException(status_code=404, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal Server Error: " + str(e))
