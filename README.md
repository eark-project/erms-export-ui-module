# ERMS Export Module (EEM)

The EEM helps to extract records and their metadata from an ERMS in a controlled manner. The module is composed of a backend and a frontend. The backend is a RESTful service (running on a Tomcat server) written in Java, and the frontend is a web application (running on an Apache HTTP Server) written in AngularJS. The EEM is capable of connecting to a repository that supports the CMIS (Content Management Interoperability Services) protocol (CMIS version >= 1.0 is supported) as seen in the figure below:

![The EEM](https://github.com/magenta-aps/erms-export-ui-module/blob/master/doc/eem.png)

An example of an extraction can be seen [here](https://www.youtube.com/watch?v=-L8WVfAZ3C8&index=1&list=PLj-yd-_ObnNfjfKS-lBpThD4xrs-NRAIU)

This GitHub repository contains the code for the frontend of the ERMS Export Module. The code for the backend can be found [here](https://github.com/magenta-aps/E-Ark-ERMS-export-bridge)

Included features are

* Repository profile creation and manipulation
* Mapping upload (see details below)
* Selection of contents to extract
* Extraction of data and metadata from a repository

# Installation
Before installing this frontend, you need to setup the backend of the EEM. The instructions for how to do this can be found on the link above.

... more to follow - handling backend doc first




# Angular stub for Alfresco/AngularJS UI projects

This repo's code serves as a starting point for new projects combining Alfresco backend and AngularJS frontends.


* Authentication
* Build setup with Gulp
* Sass pre-processing of CSS (scss)


## Get up and running

1. Clone the project
2. Setup a server
3. Run terminal commands
´´´
npm update
npm install
gulp build
´´´
4. [Then read the documentation](/documentation/README.md)


## ToDo

**Good to go**

- [x] authentication - maybe add some documentation
- [x] dashboard - modularize
- [x] footer - maybe add some documentation
- [x] header - maybe add some documentation
- [x] i18n

**Shame**
- [ ] common
- [ ] core
- [ ] *documents*
- [ ] *files*
- [ ] shared
- [ ] *search*

**Possibly delete**
- [ ] groups
- [ ] system_settings
- [ ] admin
- [ ] users 
