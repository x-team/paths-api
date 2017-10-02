# Paths API

[![serverless](http://public.serverless.com/badges/v3.svg)](http://www.serverless.com)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](#contributing)

Maintained by the [developers at x-team](https://www.x-team.com) | [developer blog](https://www.x-team.com/blog/)

## Prerequisites

[Yarn](https://yarnpkg.com/en/)
[Serverless Framework](https://serverless.com/framework/)

## Installation

```
git clone https://github.com/x-team/paths-api
cd paths-api
yarn
npm run prepare
```

## Offline development

```
npm run dev
```

This command will create local DynamoDB instance and start API on port 1337.

Any changes to source files will restart server thanks to Nodemon.

## Deployment

```
sls deploy
```


