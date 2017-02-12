## Purpose

Grapple facilitates user uploadig files from their browser to an s3 bucket

## Description

On Cybertron, Grapple's buildings are considered works of art. On Earth, his ideas are limited by war. Takes pride in his work, prone to severe depression if they're destroyed in battle. As crane, can lift up a 35-ton object and position it with precision and grace. As robot, has high-temperature arc-welder rifle... can launch rockets 4.5 miles from wrist sockets. Grapple is prone to breakdown in vehicle mode.

## Endpoints

### GET /sign-s3

Query Parameters

`file-name`: `string` -> The name of the file which you will be uploading

`file-type`: `string` -> The MIME type of the file to be uploaded. See [Sitepoint](https://www.sitepoint.com/web-foundations/mime-types-complete-list/) for a full list of acceptable types

Response body

```javascript
{
  signedRequest: string, // 
  url: string // this is the url of the s3 bucket which the file will be uploaded to
}
```