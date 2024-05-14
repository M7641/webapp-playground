# Making a React App

Other bits to cover:

1. Installing Node.js and then getting npm. Does bun have the same thing? Worth a look.
2. yarn vs npm.
3. tsconfig.json and what we can do with it.
4. npm run dev to actually run scripts defined in the package.json.

## Appendix 1 - --save-dev / --save

--save-dev will add package versions to the `devDependencies` key in package.json. --save, on the other hand, will add the package to the `dependencies` key. This is important to keep on top off as it will reduce the amount of dependencies in production and thus keeping the bundle as minimal as possible.

I have not seen this in the wild, but there are also --no-save, --save-prod, --save-optional, --save-peer and --save-bundle. It is still not clear on what the -i flag was doing if anything. I may have just made it up actually, I might be thinking of just i which is an alias for install.

## Appendix 2 - npx

First, npm is the node package manager. npx is a package runner.

The following are equivalent in what they achieve:

```sh
npx tsc
npm exec tsc
```

The major difference is that npm will keep more fluff around after it has been ran. A delightful analogy I found on reddit was:

NPX: Pizza delivery dude brings you a pizza. Pizza delivery dude leaves right after delivery. The pizza is still there with you.

NPM: Pizza delivery dude brings you a pizza. He doesn't leave. You and pizza delivery dude now live together. Pizza is still there too.

All in all, use npx when running executables and use npm to manage what packages are installed. The part that was initially confusing me is that npx won't run the scripts defined in package.json. Rather, you need `npm run ...` for this. In those scripts, however, you should look to use npx.

## 0 - Dependencies:

The two react packages:

```sh
npm i react react-dom -S
npm i --save-dev @types/react @types/react-dom
```

The blog I am following has said to install babel and webpack, but I want to wait until they become needed. I would also prefer Vite as well for that matter.

Installing typescript:

```sh
npm install typescript --save-dev
```

## 1 - First files

The three initial files to make are:

1. index.html
2. App.tsx
3. main.tsx

Blog wants JS but I will start with TS and see how I get on.

A note on tsx, ts is just for pure typeScript whereas the tsx is required for react components as that extension makes it clear that jsx is involved. jsx is needed to put the html elements in the return.

main is the bit of of code that will trigger React to render in the index.html file which is just a container with a root div. It is that root div that will be filled with the App being declared in App.tsx.

### Vite

I will be using Vite to bundle all of my files into something that can then actually be ran as if it were a web application.

install:

```sh
npm install -i vite
npm install --save-dev @vitejs/plugin-react
```

Adding the config:

```sh
touch vite.config.ts
```

Adding tsconfigs:

```sh
touch tsconfig.json
touch tsconfig.node.json
```

There appears to be a lot going on in these two files. Not sure it is something to cover here, but worth looking into what leavers are possible here also.

Then we are able to run:

```sh
npx vite dev
```

Although, at this point it is currently not working as the react app part is not rendering. The index.html part is however.

Got it. We needed to have both:

```html
<div id="root"></div>
<script type="module" src="/src/main.tsx"></script>
```

in the body of the index.html. On that note, it is working.

### Babel

```sh
npm install --save-dev @babel/preset-react
```

Then creating a file called `babel.config.json` with the following:

```json
{
    "presets": [
      [
        "@babel/preset-env",
        {
          "targets": {
            "edge": "17",
            "firefox": "60",
            "chrome": "67",
            "safari": "11.1"
          },
          "useBuiltIns": "usage",
          "corejs": "3.6.5"
        }
      ]
    ]
  }
```

What is babel? The story of "The Library of Babel" develops the idea of a infinite library with every single permutation of book possible. In that spirit, babel will convert the TS/JS we write into code that will run on the specified targets. JS has added a number of features over the years and common syntax today won't work on older browsers, babel lets us stay on the bleeding edge whilst maintaining the ability to run on older browsers.

### In the future

Things are largely working now. When doing this in the future, you are better off using the templates for these things given there are a lot of boilerplate to have set up. To create an app from a template you may doing something as follows:

```sh
npx create-react-app my-app --template typescript
```

## 2 - Ensuring a server side exists

Well that was a pain.

Without NextJS it is a complete pain. What is working locally, at least, is that I had to make a server directory that was starting an Express server. I ended up creating CORS errors when trying to fetch from it. This bit was solved by having the following `vite.config.ts`

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5050",
        secure: false,
      },
    },
  },
  plugins: [react()],
});
```

This does make me rather confused however. Why did this not work on the platform? Did I even try it? I don't now how I would run two services in the same dockerfile at once after all. Yeah, I think this is what blocked me in the first instance.

It appears I have found a solution:

```sh
#!/bin/bash

# Start the first process
npm run dev &

# Start the second process
npm run serve &

# Wait for any process to exit
wait -n

# Exit with status of process that exited first
exit $?
```

This will run both at the same time and so you can run this script to run both. With the proxy that should get around the issues with the CORS policy. It's not an ideal use of the cloud though. In a perfect world it would be a docker-compose that lets both services talk to each other. I say perfect, better at least.

This does blow open a huge number of possibilities. I did express, but I don't see why the code in that server can't be anything I want it to be. Yeah, as long as it can be ran from Bash then there won't be a problem.

Amusingly, I got stuck with the server even though I exited out. To address that, I did

```sh
lsof -i :portNumber # 5050 in this particular case
kill PID # PID is provided by the first command.
```

In response to that, I found a better solution:

```sh
trap 'kill 0' SIGINT; npm run dev & npm run serve & wait
```

One thing, the docker will be gnarly. I came across this which is what I should try follow:

```dockerfile
# go build
FROM golang:1.16.3 AS go-build

WORKDIR /
COPY    backend backend
RUN     CGO_ENABLED=0 go build

# node build
FROM node:15.13.0 AS node-build

WORKDIR /
COPY frontend frontend
RUN \
    npm i && \
    npm run build

#
# final stage:
#
FROM scratch

COPY --from=go-build \
    /backend/rest-server \
    /app/rest-server

COPY --from=node-build \
    /frontend/dist \
    /app/dist/

CMD ["/app/rest-server"]
```