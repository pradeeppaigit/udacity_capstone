# Serverless TODO

This is a Todo list maintenance Application hosted on AWS Serverless.
A User can create,update,delete and view all the created todos.

# Functionality of the application

- This application allows users to create, view, update, delete todos.
- This application allows users to upload an image associated with a todo.
- This application displays the todos only for a logged in user(User Authenticated via Auth0).
- A user would have to authenticate in order to use the app.
- A user will also get the notification for the current session and the session id is stored in the database table.
- An id will be shown once the user connects to the websocket:- with below
  `wscat -c wss://yo98ge78qh.execute-api.us-east-1.amazonaws.com/dev`

# TODO items

The application stores TODO items, and each TODO item contains the following fields:

* `todoId` (string) - a unique id for an item
* `createdAt` (string) - date and time when an item was created
* `name` (string) - name of a TODO item (e.g. "Change a light bulb")
* `dueDate` (string) - date and time by which an item should be completed
* `done` (boolean) - true if an item was completed, false otherwise
* `attachmentUrl` (string) (optional) - a URL pointing to an image attached to a TODO item
* `userId` (string) - userId of the user who created the todo as provided by Auth0 application

# Functions

Following Lambda functions were written and configured in the `serverless.yml` file:

* `Auth` - this function implements a custom Auth0 authorizer for API Gateway that is added to all other functions.

* `GetTodos` - returns all TODOs for a current user. A user id is extracted from a JWT token that is sent by the frontend.

Function returns data that looks like this:

```json
{
  "items": [
    {
      "todoId": "123",
      "createdAt": "2019-07-27T20:01:45.424Z",
      "name": "Buy milk",
      "dueDate": "2019-07-29T20:01:45.424Z",
      "done": false,
      "attachmentUrl": "http://example.com/image.png"
    },
    {
      "todoId": "456",
      "createdAt": "2019-07-27T20:01:45.424Z",
      "name": "Send a letter",
      "dueDate": "2019-07-29T20:01:45.424Z",
      "done": true,
      "attachmentUrl": "http://example.com/image.png"
    },
  ]
}
```

* `CreateTodo` - creates a new TODO for the current user. A shape of data sent by a client application to this function can be found in the `CreateTodoRequest.ts` file

It receives a new TODO item to be created in JSON format that looks like this:

```json
{
  "createdAt": "2019-07-27T20:01:45.424Z",
  "name": "Buy milk",
  "dueDate": "2019-07-29T20:01:45.424Z",
  "done": false,
  "attachmentUrl": "http://example.com/image.png"
}
```

It returns a new TODO item that looks like this:

```json
{
  "item": {
    "todoId": "123",
    "createdAt": "2019-07-27T20:01:45.424Z",
    "name": "Buy milk",
    "dueDate": "2019-07-29T20:01:45.424Z",
    "done": false,
    "attachmentUrl": "http://example.com/image.png"
  }
}
```

* `UpdateTodo` - updates a TODO item created by a current user. A shape of data send by a client application to this function can be found in the `UpdateTodoRequest.ts` file.

It receives an object that contains three fields that can be updated in a TODO item:

```json
{
  "name": "Buy bread",
  "dueDate": "2019-07-29T20:01:45.424Z",
  "done": true
}
```

The id of an item that should be updated is passed as a URL parameter.

It should return an empty body.

* `DeleteTodo` - deletes a TODO item created by a current user. Expects an id of a TODO item to remove.

It should return an empty body.

* `GenerateUploadUrl` - returns a pre-signed URL that can be used to upload an attachment file for a TODO item.

It returns a JSON object that looks like this:

```json
{
  "uploadUrl": "https://s3-bucket-name.s3.us-east-1.amazonaws.com/image.png"
}
```

All functions are connected to appropriate events from API Gateway.

Necessary resources are in the `resources` section of the `serverless.yml` file.

# Frontend

The `client` folder contains a web application that uses the API.
This frontend works with serverless application. The `config.ts` file in the `client` folder contains an API endpoint and Auth0 configuration.

## Authentication

Auth0 application was created and configured using asymmetrically encrypted JWT tokens.

## Best Pratices

- All resources in the application are defined in the `serverless.yml` file.
- Each function has its own set of permissions.
- Application has sufficient monitoring with logging enabled.
- HTTP requests are validated.

## Architecture

- Data is stored in a table with a composite key.

```
KeySchema:
      - AttributeName: partitionKey
        KeyType: HASH
      - AttributeName: sortKey
        KeyType: RANGE
```

- items are fetched using the `query()` method and not `scan()` method (which is less efficient on large datasets)

# How to run the application

## Backend

To deploy an application run the following commands:

```
cd backend
npm install
sls deploy -v
```

## Frontend

To run a client application first edit the `client/src/config.ts` file to set correct parameters. And then run the following commands:

```
cd client
npm install
npm run start
```

This should start a development server with the React application that will interact with the serverless TODO application.

## Testing
The application can be tested from frontend directly.
Another way to test the application is via Postman.
A test collection is attached and named `CapstoneProject.postman_collection.json`. 
Upload the tests and run the collection. Results will be displayed accordingly.
