# look-on-point
The main goal of the project is to deliver a mobile React Native app for sharing and rating clothing styles in a community format via images; delivering a peer-to-peer platform to acquire honest opinions about personal everyday fashion, helping people to decide what to wear for all types of occasions as well as for consuming content and getting inspiration. The users should furthermore have the ability to interact with one another in real time, through a comment field attached to each look uploaded on the platform.

## Getting started

### Deployment

The application requires three separate terminals to run:

- the main backend with the REST API
- the server for real-time sockets
- the mobile application

Simplify follow the instructions below to run the app locally on your machine!

**Terminal 1:**

The main backend in Django; requires installation and activation of a python virtualenv.

```
python3 -m venv  LookOnPoint/local_python_environment
source LookOnPoint/local_python_environment/bin/activate
pip install -r LookOnPoint/requirements.txt
python LookOnPoint/LookOnPoint/manage.py runserver 0.0.0.0:8000
```

**Terminal 2:**

The complementary backend server for real-time comments via sockets in Node.

```
cd LookOnPoint/nodeapp
npm install
node app.js
```

**Terminal 3:**

The mobile application in React Native; requires some node modules to be installed.

```
cd LookOnPoint
npm install
npm start
```

Then follow Expo instructions for displaying app on either Android/iOS emulator or smartphone.

### Additional

View tables in database from terminal - in dir: root/LookOnPoint/LookOnPoint:

```
sqlite3 database.db
.tables
```

Or you can just navigate to localhost:8000 while the backend server is running and all tables can be viewed and managed from the Django UI.

## Authors

**Jonathan Rintala**

## License

This project is licensed under the MIT License - see the [LICENSE.md](https://gist.github.com/PurpleBooth/LICENSE.md) file for details.
