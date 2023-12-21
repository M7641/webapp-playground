
To get it running on Docker:
1. Ensure that `npm run build` has been ran which makes sure all the compiled code is ready to be moved over.
2. Run `docker build -t next-app .`. This will build the image.
3. Run `docker run -dp 127.0.0.1:3000:3000 next-app` will then run the docker which can be accessed through the localhost:3000
4. Then you can go to the `localhost:3000` and you can see the app!

The current issue is that the python side is not coming up, but this is not an issue with docker. Rather there is an
issue with the npm run build as npm run start is not working either.