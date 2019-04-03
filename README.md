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

### Authors

- **Jonathan Rintala**

### License

This project is licensed under the MIT License - see the [LICENSE.md](https://gist.github.com/PurpleBooth/LICENSE.md) file for details.

### Dev comments

- **Future:** 
	- Add functionality for comparing two outfits - slide image - rate for favorite through radio buttons.
	- MainFeed: on drag up - fetch new posts and update/refresh feed.

- **25 March:** Decided to use SQLite for DB. Primarily since already setup by default with Django backend which will save time. Also found solid plugin for React Native "react-native-sqlite-2".
  - Source: https://pusher.com/tutorials/persisting-data-react-native
  - Shouldnt be necessary - since we can go through Django end points at all times
    - https://stackoverflow.com/questions/34305805/django-foreignkeyuser-in-models