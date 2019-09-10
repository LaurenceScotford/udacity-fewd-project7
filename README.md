# Udacity Front-End Web Developer Nanodegree
## Project 7 - Restaurant Reviews App

This project is a responsive and accessible web app with offline capability. It is adapted from the base code supplied by Udacity for the project.

### Target platforms
This site is designed for recent browsers (across multiple devices) that support HTML5 and ES6.

### How to install and run this app
To run this app locally you will need to have node and npm installed.

1. Clone the repository into a local repository
2. Create a terminal at the root of the local repository and enter **npm install** at the command line. This will install development dependencies locally (del, gulp, gulp-cli, gulp-connect).
3. Once dependencies have been installed, enter **gulp** at the command line. This will build the app and open a webserver at http://localhost:8080
4. Open a recent ES6 compliant browser, e.g. Chrome and navigate to http://localhost:8080
5. To close the server at the end of the session, return to the terminal and enter **ctrl+C** at the command line.

### Features
- Responsive design - works across multiple devices (from mobile to desktop)
- Accessible to users using assistive technologies (caveat: the version of leaflet.js specified for this project doesn't work particularly nicely with screen readers - see https://github.com/Leaflet/Leaflet/issues/3210)
- Caches resources for offline access - the core app and current version of the restaurant data will be cached immediately when the app is first launched. The strategy for resources that may change dynamically, e.g. images, third-party code and assets for maps, is to cache them as they are encountered. Note that the app will always try to get the latest version of a resource from the network, but will fall back to a cached version if the network version is unavailable.
