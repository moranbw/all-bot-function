# all-bot-function

All Bot will mention users in your GroupMe group, provided the message begins with `@all`. This of course should be easily customizable.

Example given is for an AWS Lambda function, but easily portable. In my case I used the GroupMe callback functionality to post to an API Gateway route, which then triggers the Lambda.