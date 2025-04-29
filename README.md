Make sure to cd into the app since the first folder wont remove!

Back End - In one terminal: source myvenv/bin/activate Install pip modules pip3 install django djangorestframework django-cors-headers cd django_back_end Make database migrations python3 manage.py makemigrations api_app python3 manage.py migrate Run the app python3 manage.py runserver python3 manage.py runserver 0.0.0.0:8000 (for receiving external traffic)

Front End - In a separate terminal: 'cd expo-app' Install node_modules npm install Run the app npm start
