# LookOnPoint
A React Native project in the KTH course intnet19.

Readme template: https://gist.github.com/PurpleBooth/109311bb0361f32d87a2

## Getting started

### Deployment

Run server:

```
source LookOnPoint/env/bin/activate
python LookOnPoint/LookOnPoint/manage.py runserver 0.0.0.0:8000
```

Run application:

```
npm start
```

- Then follow Expo instructions for displaying app on either Android/iOS emulator or smartphone.

View tables in database from terminal - in dir: root/LookOnPoint/LookOnPoint:

```
sqlite3 database.db
.tables
```



### Authors

- **Jonathan Rintala**

### License

This project is licensed under the MIT License - see the [LICENSE.md](https://gist.github.com/PurpleBooth/LICENSE.md) file for details.

### Dev comments

- **Future:** 
  - Add functionality for comparing two outfits - slide image - rate for favorite through radio buttons.

  - Comments - implement sockets for live updating comments

  - Authentication - add logout, destroy JWT token

    

- **8 April:**

  - After tideous bug research - found that restart of app after imagePicker is a dev issue - will resolve once app is published
  - Similar:
    <https://github.com/react-native-community/react-native-image-picker/issues/471>

- **7 April:**

  - Added hashing using Django's built in user and password management system
  - Source: <https://docs.djangoproject.com/en/2.1/topics/auth/passwords/>

  

  - Setup Tokens with time limit:

    - ```
      pip install django-rest-auth
      pip install djangorestframework-jwt
      pip install django-allauth
      ```

      <https://michaelwashburnjr.com/django-user-authentication/>

  

- **25 March:** Decided to use SQLite for DB. Primarily since already setup by default with Django backend which will save time. Also found solid plugin for React Native "react-native-sqlite-2".
  - Source: https://pusher.com/tutorials/persisting-data-react-native
  - Shouldnt be necessary - since we can go through Django end points at all times
    - https://stackoverflow.com/questions/34305805/django-foreignkeyuser-in-models