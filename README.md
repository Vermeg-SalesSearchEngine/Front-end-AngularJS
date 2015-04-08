# Front-end Angular
This project provide a search engine front for sales service .It depends on Elasticsearch server and [converter Rest service] (https://github.com/Vermeg-SalesSearchEngine/MicroService-converter).

## Requirements

- Install Node
    - on OSX, install [home brew](http://brew.sh/) and type `brew install node`
    - on Windows, use the installer available at [nodejs.org](http://nodejs.org/)
- Open terminal
- Type `npm install --global  bower grunt-cli`
- 
##Config
In order to support data binding in handsonTable you need to edit bower_components\nghandsontable\dist\ngHandsontable.js
Add thos 3 lines after line 267
 ```                      
   function () {
++   //for binding scope.data to handstontable
++   scope.htSettings['data'] = scope.datarows;
++     settingFactory.updateHandsontableSettings(scope.hotInstance, scope.htSettings);
                            settingFactory.renderHandsontable(scope.hotInstance);
                        }
                    );
```
## Quick Start
Clone this repo and run the content locally:
```bash
$ npm install
$ grunt serve
```
- `npm install` will install the required node libraries under `node_modules` and then call `bower install` which will install the required client-side libraries under `bower_components`.
- `gulp serve-dev` will serve up the Angular application in a browser window. It is designed for an efficient development process. As you make changes to the code, the browser will update to reflect the changes immediately.

When you are ready to build the application for production, run the following command:
```bash
$ grunt build
```
