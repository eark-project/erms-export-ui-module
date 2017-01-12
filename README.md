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


# Mapping of metadata from the ERMS to the SMURF format

The EEM needs to know how to map the metadata associated with the content in the ERMS to the extended EAD format used in the SMURF profile (the specification of the SMURF file can be found elsewhere). 
This mapping is facilitated via an XML mapping file which must be valid according to this [XML schema](https://github.com/magenta-aps/E-Ark-ERMS-export-bridge/blob/master/src/main/resources/mapping.xsd). 
In order to explain how to create the required mapping file, we will use a concrete mapping as an example. This mapping can be found [here](https://github.com/magenta-aps/E-Ark-ERMS-export-bridge/blob/master/src/main/resources/mapping.xml), but it will also be broken down to smaller pieces below.

## Example of how to create a mapping

Before diving into the details of the mapping, a few comments are needed on the CMIS compliant repository used in this example.

### Example CMIS compliant repository

We will assume that we are extracting data from the [Alfreco](https://community.alfresco.com/community/ecm) ECM system. Let us further assume that this Alfresco repository contains three content types that are of interest to us: *series*, *subseries* and *records*, and that the content within the repository is organized in a hierarchically manner as shown in this figure:

![Structure of the content in the ERMS](https://github.com/magenta-aps/erms-export-ui-module/blob/master/doc/export-erms.png)

From the figure it is seen that series contains subseries with then again contains records, and the records contains the actual content in the form of folders and files. 
We will call the series, the subseries and the records for *semantic types*. As can be seen in the figure, the records are (in this example) the semantic leafs of the tree structure. 
The semantic types have metadata associated with them, e.g. a creation date, a repository UUID, a title and so on.

### The purpose of the mapping

One (or more) mapping file(s) must be created for each repository in order to:

* Instruct the ERMS Export Module about which CMIS types (i.e. the semantic types mentioned above) to export
* Instruct the ERMS Export Module about which CMIS types (i.e. the semantic types but also other types in the ERMS) to display in the frontend
* Map CMIS metadata to the EAD format (an XML file containing metadata) in the SMURF profile.
* Modify CMIS metadata if these are invalid according to the EAD schema

### The structure of the mapping XML file

The first section of the mapping XML file concerns the semantic types that we would like to extract:

```
<!-- Corresponding to the CMIS property ID "cmis:objectTypeId" -->
<objectTypes>
  <objectType id="series" leaf="false">F:eark:series</objectType>
  <objectType id="subseries" leaf="false">F:eark:subseries</objectType>
  <objectType id="record" leaf="true">F:eark:record</objectType>
</objectTypes>
```

The various CMIS object types have their own object type ID corresponding to the CMIS property ID `cmis:objectTypeId`. In this example we see that the value of the 
`cmis:objectTypeId` for a series is `F:eark:series`. Hence, in the mapping we define an `<objectType>` called "series" (the id of the XML element) and that object type 
should be associated with the `F:eark:series` CMIS object type id. The other semantic types are defined in a similar way. Note that we also have to specify if the 
semantic types are leafs or not.

Next, we define what in known as the so called *viewTypes*. The view types are the CMIS object types that should actually be shown in the frontend, i.e. in the example 
it is seen that the frontend will show more CMIS object types than the semantic types that will be extracted:

```
<!-- The viewTypes are the CMIS object types that should be reflected by the frontend viewer -->
<viewTypes>
  <viewType>F:eark:series</viewType>
  <viewType>F:eark:subseries</viewType>
  <viewType>F:eark:record</viewType>
  <viewType>cmis:document</viewType>
</viewTypes>
```

The next section is the EAD templates section, i.e. the . In this section, the `<c>` element that is going to be used in the EAD file is constructed. The relevant 
`<c>` element (for the semantic type of interest) is located within the `<ead>` element which in turn is located within the `<eadTemplates>` element. 








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
