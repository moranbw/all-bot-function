# all-bot-function

All Bot will mention users in your GroupMe group, provided the message begins with `@all`. This of course should be easily customizable.

Example given is for a Cloudflare Worker, but easily portable. In my case I used the GroupMe callback functionality to POST to the endpoint of my Worker.