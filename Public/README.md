This static "Resume" website was created as a requirement 
for my application for admission to Prime Digital Academy.


heroku buildpacks:set heroku/nodejs
to package.json:
{
  "name": "static-html-app",
  "version": "1.0.0",
  "scripts": {
    "start": "npx serve public"
  },
  "dependencies": {
    "serve": "^14.0.0"
  }
}
