# facepile

serve up avatars from your Slack team.

```
SLACK_TOKEN="xoxp-foo-bar-baz" ./node_modules/.bin/babel-node index.js

curl localhost:4567/user@domain.com

HTTP/1.1 200 OK
Connection: keep-alive
Content-Length: 824
Content-Type: application/json; charset=utf-8
Date: Thu, 27 Oct 2016 18:13:41 GMT
X-Powered-By: Express

{
    "image_192": "https://secure.gravatar.com/avatar/foo-192.png",
    "image_24": "https://secure.gravatar.com/avatar/foo-24.png",
    "image_32": "https://secure.gravatar.com/avatar/foo-32.png",
    "image_48": "https://secure.gravatar.com/avatar/foo-48.png",
    "image_72": "https://secure.gravatar.com/avatar/foo-72.png"
}

```
