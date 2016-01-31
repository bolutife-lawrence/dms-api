# Documnent Managemant System (API)
![BUILT WITH NODE](https://raw.githubusercontent.com/pixel-cookers/built-with-badges/master/node/node-long.png)
![BUILT WITH mongoDB](https://raw.githubusercontent.com/pixel-cookers/built-with-badges/master/mongoDB/mongodb-long-flat.png)
[![Build Status](https://travis-ci.org/andela-blawrence/DMS-REST-API.svg)](https://travis-ci.org/andela-blawrence/DMS-REST-API)
[![Coverage Status](https://coveralls.io/repos/andela-blawrence/DMS-REST-API/badge.svg?branch=dev&service=github)](https://coveralls.io/github/andela-blawrence/DMS-REST-API?branch=dev)
[![Code Climate](https://codeclimate.com/repos/5670c8013946f27716000977/badges/84128e99aba126ced466/gpa.svg)](https://codeclimate.com/repos/5670c8013946f27716000977/feed)
[![Issue Count](https://codeclimate.com/repos/5670c8013946f27716000977/badges/84128e99aba126ced466/issue_count.svg)](https://codeclimate.com/repos/5670c8013946f27716000977/feed)

The system manages documents, users and user roles. Each document defines access rights; the document defines which roles can access it. Also, each document specifies the date it was published.

Users are categorized by roles. Each user must have a role defined for them.

## Code Example

**Create a new user**
```
POST - http://dms-api.herokuapp.com/api/v0.1/users

Post data
{
  username: 'username',
  email: 'example@host.com'
  name: {
    last: 'lastname',
    first: 'firstname'
  }
  password: 'password',
  role: 'dummy role' // Role has to be created before assignation.
}
```

**********

**Create a new document**

Documnent is created by an existing and authenticated user.

```
POST - http://dms-api.herokuapp.com/api/v0.1/users

Post data
{
  title: 'Documnent title',
  content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut  enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
}
```

***********

**Create a new role - Superadmin operation**

Role is created by an Authorized and Authenticated user (superadmin).

```
POST - http://dms-api.herokuapp.com/api/v0.1/users

Post data
{
  title: 'Trainer'
}
```
## Motivation

This project was setup with the intention of creating a secure platform where documents created remain confidential to their owners and featured owners. It is still in its initial stage. I do hope that it will gain maximum usage and recognition later on as I and other interested folks continue to work on it. :grin:

## Installation

Note: You need to have the following installed.

- MongoDB - [Download here](https://docs.mongodb.org/manual/installation/)
- NodeJS - [Download here](https://nodejs.org/en/download/)

Then, clone the repository and run the ``` npm install ``` command in the same directory.


## API Reference

API endpoints currently supported.

_*Users*_

Request type | Endpoint | Action | Privilege
------------ | -------- | ------ | ---------
POST | /api/v0.1/users | Create a new user | Anyone
GET | /api/v0.1/users | Get all users | Superadmin and Admin
GET | /api/v0.1/users:id | Get a specific user | Authenticated user
PUT | /api/v0.1/users/:id | Update user information | Authenticated and Authorized user
DELETE | /api/v0.1/users/:id | Remove a user from storage | Superadmin

_*User Image Upload*_

Request type | Endpoint | Action | Privilege
------------ | -------- | ------ | ---------
POST | /image/upload | Upload or change users' profile picture | Authenticated user
DELETE | images/:id | Remove profile picture | Authenticated user

_*Documents*_

Request type | Endpoint | Action | Privilege
------------ | -------- | ------ | --------
POST | /api/v0.1/documents | Create a new document | Authenticated user
GET | /api/v0.1/documents | Retrieve all documents | Superadmin and Admin
GET | /api/v0.1/documents/:id | Retrieve a specific document | Documnent Owner
GET | /api/v0.1/users/:id/documents | Retrieve all documents created by a user | Documnent Owner
GET | /api/v0.1/roles/:id/documents | Retrieve all documents with a specific role | User with specified role
PUT | /api/v0.1/documents/:id | Update a specific document | Documnent Owner
DELETE | /api/v0.1/documents/:id | Remove a specific document from storage | Documnent Owner


_*Roles*_

Request type | Endpoint | Action | Privilege
------------ | -------- | ------ | ---------
POST | /api/v0.1/roles | Create a new role | Superadmin
GET | /api/v0.1/roles | Retrieve all roles | Superadmin and Admin
GET | /api/v0.1/roles/:id | Retrieve a specific role | Superadmin and Admin
PUT | /api/v0.1/roles/:id | Change a role name | Superadmin
DELETE | /api/v0.1/roles/:id | Remove a specific role form storage | Superadmin

## Tests

After installation, run the ``` npm test ``` command to run all tests.

## Contributors

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :+1:

## License

![MIT LICENSE](https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/License_icon-mit.svg/120px-License_icon-mit.svg.png)

****

:sunglasses::sunglasses:
