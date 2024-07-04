# flowchart-executor

A GUI tool to execute Python scripts in flowcharts.

This GUI tool has its backend under \aiflowchartserver and front end under \WorkflowEditor.

----

## Backend: A Djangdo server project.

### Dependencies

Python 3.12.2
Django 5.0.4
django-cors-headers 4.3.1
mysqlclient 2.2.4
Celery 5.4.0
eventlet 0.36.1  (Windows only)

### Structure

1. **aiagent** is the app to support all AI contacts.

2. **flowchartagent** is the app to execute the incoming scripts.

3. **objects** has DTO classes.

4. **utils** has all utilities.

5. **zhipuvisit** contains the tools for Zhipu API visiting.

6. **celeryapp** is the celery application, the asynchronous task executer.

### Database

This project depends on a MySQL database 8.0.23.

### Redis

Both Celery and Channels requires Redis as a broker. Please find "CELERY_" attributes and CHANNEL_LAYERS on "\flowchart-executor\aiflowchartserver\aiflowchartserver\settings.py" and setup the links there.


### Configurations

1. The Djando settings are at "\flowchart-executor\aiflowchartserver\aiflowchartserver\settings.py". 

The Celery service also use the same configuration file. 


2. The DB configuration is at "\flowchart-executor\aiflowchartserver\aiflowchartserver\mysqldb.cnf". It is not directly provide on git. Please create a text file and copy the following configuraiton there. Update the username and password.

```
[client]
database = workflowenginedb
user = ????
password = ????
default-character-set = utf8
```

3. To activate AI programing, add your Zhipu API key to "\flowchart-executor\aiflowchartserver\zhipuvisit\apikey.txt".

### Data model migration

Execute "python manage.py migrate" at "\flowchart-executor\aiflowchartserver" to migrate the models to DB. 


### Start Server

Please be sure that the DB and Redis are in service before starting the server.

1. It is recommended to develop and test this project in Idea. Open project folder "aiflowchartserver", in the run configuration, add "manage.py" as the script and add "runserver 8100" as the parameter.

If to run in commandline, execute `python manage.py runserver 8100`.

2. Start the Celery service.

Ceed to path "\flowchart-executor\aiflowchartserver". If on Windows, execute the following command. 

```cmd
celery -A celeryapp worker --loglevel=INFO -P eventlet
```

If you are on Linux, "-P eventlet" is not necessary.


----

## Front end: WorkflowApp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.0.0.

The flowchart is applying [ng-flowchart](https://github.com/joel-wenzel/ng-flowchart). 

The frontend depends on [Bootstrap](https://v5.bootcss.com/docs/getting-started/introduction/) v5.

The code editing area is [ngx-codemirror](https://github.com/scttcper/ngx-codemirror).

### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

### Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

