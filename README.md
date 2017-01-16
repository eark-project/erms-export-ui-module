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
Before installing this frontend, you need to setup and start the backend of the EEM. The instructions for how to do this can be found on the link above. You will also need to have 
[Node.js](https://nodejs.org/en/) and [NPM](https://www.npmjs.com/) installed and running.

1. Clone the GitHub project. You can do it with a terminal command:

```
$ git clone https://github.com/magenta-aps/erms-export-ui-module.git
```

2. Wire the EARK Platform UI to the backend by changing the proxy settings in the gulpfile.js.

3. Browse to the project folder and build the project using npm and gulp:

```
/erms-export-ui-module/$ npm update
/erms-export-ui-module/$ npm install
/erms-export-ui-module/$ gulp build
```

4. Set up hosting (for example by using an [Apache HTTP server](https://httpd.apache.org/)) for your project files and point it to `/erms-export-ui-module/index.html`

5. Open a web browser and point it to the URL where your project is hosted. Consult your backend provider to get usernames and passwords for login.


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

The next section is the EAD templates section, i.e. the contained within the `<eadTemplate>` element. This section has a number of `<template>` elements belonging to 
the different semantic types described above. Note that the template elements for the semantic types are located side by side within the eadTemplates element, i.e. 
the semantic *structure* in the form of a tree as seen in the figure above is not reflected in the mapping file (that part is handled automatically when 
the EEM is traversing the repository in a recursive manner via CMIS):

```
<eadTemplates>
  <template id="series">
    <hook>...</hook>
    <ead>...</ead>
  </templates>
    <hook>...</hook>
    <ead>...</ead>
   <template id="subseries">
  </templates>
    <hook>...</hook>
    <ead>...</ead>
   <template id="record">
  </templates>
<</eadTemplates>
```

In the template element we see two elements: `<hook>` (inside `<hooks>`) and `<ead>`. The ead element will be discussed first. This element must contain the `<c>` element that is going to 
be used in the final EAD file in the SMURF profile. This c element contains anything that is allowed within a c element according to the EAD XML schema, i.e. 
it defines which EAD elements and attributes should go into the final EAD. The `<hook>` elements defines how to map the repository metadata (exposed via CMIS) to 
the elements and/or attributes that have been defined in the `<c>` element. Let's use the record as an example:

```
<template id="record">
  <hooks>
    <hook>
      <xpath>child::ead:did/child::ead:unitdate</xpath>
      <cmisPropertyId>cmis:creationDate</cmisPropertyId>
    </hook>
    <hook>
      <xpath>child::ead:did/child::ead:unittitle</xpath>
      <cmisPropertyId>cmis:name</cmisPropertyId>
    </hook>
    <hook>
      <xpath>child::ead:did/child::ead:unitid</xpath>
      <cmisPropertyId>cmis:objectId</cmisPropertyId>
      <cmisEscapes>
        <escape regex="workspace://SpacesStore/" replacement="ID-"/>
      </cmisEscapes>
    </hook>
    <hook>
      <xpath>child::ead:did/child::ead:dao/attribute::id</xpath>
      <cmisPropertyId>cmis:versionSeriesId</cmisPropertyId>
      <cmisEscapes>
        <escape regex="workspace://SpacesStore/" replacement="ID-"/>
      </cmisEscapes>
    </hook>
  </hooks>
  <ead>
    <c level="file">
    <ead:did>
      <ead:unitdate datechar="created" />
      <ead:unittitle />
      <ead:unitid localtype="system_id" />
      <ead:dao id="to-be-filled-out-with-cmis-metadata" daotype="borndigital"	href="path-to-file" />
    </ead:did>
    </c>
  </ead>
</template>
```

The `<c level="file">` shows that the record is mapped to c-level "file" in the EAD. To keep it simple in this example, this c element only contains a `<did>` element 
that in turn contains the elements `<unitdate>`, `<unittitle>`, `<unitid>` and `<dao>`. Let us examine the first hook in the hooks section. This hook has the elements  
`<xpath>child::ead:did/child::ead:unitdate</xpath>` and `<cmisPropertyId>cmis:creationDate</cmisPropertyId>`. The `<xpath>` element indicates that the EEM will look 
for the unitdate element (inside the c element) by using the specified xpath expression. Then the EEM will extract the CMIS property `cmis:creationDate` and put the value 
of this into the `<unitdate>` element in the `<c>` element. For the other hooks/elements the same procedure goes. Note that some of the hooks also contain a `<cmisEscape>` 
element:

```
<cmisEscapes>
  <escape regex="workspace://SpacesStore/" replacement="ID-"/>
</cmisEscapes>
   
```

This cmisEscapes section is not mandatory, but it is sometimes necessay to include it. It is use to replace part of the CMIS property value if this is not allowed 
according the the EAD XML schema, i.e. in the example showed above, the string "workspace://SpacesStore" is replaced with "ID-" because the EAD schema does not 
allow "://" in the unitid element.

Finally, there is a `<dao>` element in the ead template in the mapping file. The dao element is only allowed in the leaf semantic type (have another look at the 
`<objectType>` elements). These dao element will be replaced with dao elements corresponding to the actual file(s) found within the records. If the record contains 
a hierarchy of folders and files, the dao elements for these will be placed side by side, i.e. the folder structure within the record will no longer be visible. 
So as a result we will just have one long list of dao elements referencing all the files in the record.

### The EAD template file

The final step before starting an extraction (see the video link above) is to upload an EAD template file - see this example: 
[ead_template.xml](https://github.com/magenta-aps/E-Ark-ERMS-export-bridge/blob/master/src/main/resources/ead_template.xml). In future versions of the EEM, 
the EAD template will be auto-generated, but for now you will have to upload it manually. The EAD template file just contains the first part of the EAD file,  
i.e. basically the `<control>` section, but also the very first part of the `<archdesc>` section. The rest of the EAD file will be generated by the EEM when 
the repository is traversed in order to extract data and metadata.


# Contact
In case of problems please contact [Magenta Aps](http://www.magenta.dk).



