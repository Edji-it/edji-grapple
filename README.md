## Purpose

Grapple facilitates user uploadig files from their browser to an s3 bucket

## Description

On Cybertron, Grapple's buildings are considered works of art. On Earth, his ideas are limited by war. Takes pride in his work, prone to severe depression if they're destroyed in battle. As crane, can lift up a 35-ton object and position it with precision and grace. As robot, has high-temperature arc-welder rifle... can launch rockets 4.5 miles from wrist sockets. Grapple is prone to breakdown in vehicle mode.

## Quick Start

Install [Homebrew](https://brew.sh/)

Use Homebrew to install Node and Yarn

```bash
brew install node yarn
```

Pull the Git repository


SSH
```bash
git remote add origin git@github.com:codiak/edji-grapple.git
git pull
```

HTTPS
```bash
git remote add origin https://github.com/codiak/edji-grapple.git
git pull
```

Install packages
```bash
yarn install
```

## Pushing to Heroku

Add Heroku remotes

```bash
git remote add dev https://git.heroku.com/edji-grapple-dev.git
git remote add prod https://git.heroku.com/edji-grapple.git
```

Push to `dev` or `prod`, respectively

```bash
git push dev master
git push prod master
```

## Endpoints

### GET /sign-s3

Query Parameters

`file-name`: `string` -> The name of the file which you will be uploading

`file-type`: `string` -> The MIME type of the file to be uploaded. See [Sitepoint](https://www.sitepoint.com/web-foundations/mime-types-complete-list/) for a full list of acceptable types

Response body

```javascript
{
  signedRequest: string, // the url that the file should be PUT to
  url: string // this is the url of the s3 bucket which the file will be uploaded to
}
```

### DELETE /v1/s3/:type/:asset_id

This call is used to delete assets from s3. It requests access from Optimus to delete an object, and uppon receiving access it submits the delete request(s) to s3.

Route Parameters

`type`: `string` -> The name of the asset type you want deleted. Currently accepted are audio, images and documents

`asset_id`: `string` -> The id of the asset that Optimus needs to access in order to authenticate the request