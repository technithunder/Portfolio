from celery import shared_task
import requests
import pandas as pd
from sqlalchemy import create_engine
import os
from .models import Collection
from django.core.files import File
from django.core.files.storage import FileSystemStorage
from pathlib import Path
from dotenv import load_dotenv
from django.conf import settings
# load_dotenv()
load_dotenv(dotenv_path="prod.env")

@shared_task
def create_collection(collection_id, path, file_name):
        storage = FileSystemStorage()
        path_object = Path(path)
        if not path_object.exists():
            raise FileNotFoundError(f"File not found at path: {path}")
        
        with path_object.open(mode='rb') as file:
                data_file = File(file, name=path_object.name)
                conn_str = f"postgresql+psycopg2://{os.environ.get('DATABASE_USER')}:{os.environ.get('DATABASE_PASSWORD')}@{os.environ.get('DATABASE_HOST')}:{os.environ.get('DATABASE_PORT')}/{os.environ.get('DATABASE_NAME')}?options={os.environ.get('OPTIONS')}"
                engine = create_engine(conn_str)

                df = pd.read_csv(data_file)
                file_table_name= f"{collection_id}_File_Table"
                df.to_sql(file_table_name, engine, index=False, if_exists='replace')

                engine.dispose()

        storage.delete(file_name)

        collection_obj= Collection.objects.get(collection_id= collection_id)
        collection_obj.file_table_name= file_table_name
        collection_obj.save()

        api_url= os.environ.get('ML_API_URL')
        api_key= os.environ.get('ML_API_KEY')

        headers = {
        "x-api-key": api_key,
        "Content-Type": "application/json"
        }

        data = {
        "collection_id": collection_id
        }

        try:
                response = requests.post(api_url, headers=headers, json=data)
                
                if response.status_code // 100 == 2:
                        # collection_obj.status= 'succeed'
                        # collection_obj.save()

                        user= collection_obj.user
                        user.available_credit= user.available_credit-1
                        user.save()
                        
                        return f"Collection Created"
                        
                else:
                        collection_obj.status= 'failed'
                        collection_obj.save()
                        return f"Calculation Failed"

        except Exception as e:
                collection_obj.status= 'failed'
                collection_obj.save()
                return f"Error: {e}"

        