# Social Postify

Your social platform publication tool

## Description

This is a [Nest](https://github.com/nestjs/nest) project.

This project is a management tool for social influencers, where you can organize and plan for your next publications on any given platform.

You can setup your medias registering its **title** ("Facebook", "X", "Instagram") and your **username** ("my-awesome-username"). 

You are able to plan your posts, registering the **title** ("Why you should have a guinea pig?"), a **text** ("This is why you should have a guinea pig...") and possibly an **image** in url format ("https://www.devnews.com/dead-dev.jpg"). 

Then you will be able to associate a media with a post (by their ids) and the desired date you want to publish, with year-month-day format ("2023-08-21").
You are able to filter publications that are already published and publications after a certain date using the query params "published" (boolean) and "after" (yyyy-mm-dd), respectively

You are able to create, view, edit or delete any of the information you registered.

## Installation

```bash
$ npm install
```

# Setting up the app

Copy and paste the .env.example file twice

Rename one of the files to .env

Rename the other file to .env.test

Make sure to change the variables and giving the .env.test its own database

```bash
# initiate prisma
$ npx prisma migrate dev
$ npx prisma generate

# setup test environment database
$ npm run test:prisma
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage for both, e2e and unit
$ npm run test:cov
```
