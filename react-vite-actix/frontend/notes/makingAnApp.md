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

Babel has caused a fair amount of confusion as I was struggling to see what it was doing and if it was actually working. Turns out, Vite was already doing this for us. If you see this [readme](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) you will see how you can alter babel's behavior in the Vite config.

### In the future

Things are largely working now. When doing this in the future, you are better off using the templates for these things given there are a lot of boilerplate to have set up. To create an app from a template you may doing something as follows:

```sh
npx create-react-app my-app --template typescript
```

## 2 - Ensuring a server side exists

Well that was a pain.

Without NextJS it is a complete pain. What is working locally, at least, is that I had to make a server directory that was starting an Express server. I ended up creating CORS errors when trying to fetch from it. This bit was solved by having the following `vite.config.ts`

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

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

## 3 - How do I actually run it then?

Given the lack of `npm run start` it is worth being explicit on how this can be ran.

The three scripts provided were:

```json
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
```

`npm run dev` will start the local debugging server, `npm run build` will actually build the application into the `dist/` directory, and finally it is the `npm run preview` which will run that build application.

When I get around to building a docker for this the command in the `run.sh` will be `npm run preview`.

For completion, the `run.sh` that worked was:

```sh
npm run build & wait

trap 'kill 0' SIGINT; npm run preview & npm run serve & wait
```

However, I would build the app in a previous docker layer and then copy over dist into a scratch layer.

### Thoughts on repo architecture

The `server.ts` file ended up being distinct from the frontend. In order to handle more complexity, I will now move this repo to be structured like all the attempts in this repo. So we will have the two distinct folders of `frontend/` and `backend/`. The top level will have the dockerfile and the run.sh script.

Therefore, the run.sh has changed again:

```sh
#!/bin/bash

npm run build --prefix frontend & wait

trap 'kill 0' SIGINT; npm run preview --prefix frontend  & npm run serve --prefix backend & wait
```

the `--prefix` flag was a bit of a oddity. Any backslashes meant it could not find the subsequent files.

If I decide to use a different backend, which I naturally will, then of course that second command to start the server will change.

## 4 - Generic Tooling

### ESlint

The next topic I want to work out for this is linting. Given the previous experience with Babel already working without me knowing, I will start with the idea that it's already linting. The provided tsconfig.ts does have a section for linting after all, but let us get into it either way.

It seems like we do need to set up ESlint manually, but we can then add it as a plugin for Vite.

```sh
npm i eslint vite-plugin-eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin --save-dev
```

Then we made the `.eslintrc` file with the configuration options.

The steps from here are not overly clear. We can add it to the scripts which I have done in this project. It will also prevent building if any of the rules are broken as well. There is a fix flag which I have enabled, but I am not sure if it has done anything yet.

Plenty to refine here, but VScode has picked up on it at least and it is pointing out issues as we go so I think this is in a good place.

### Husky

It's pre-commit, but for JavaScript.

```sh
npm install --save-dev husky
```

Given my `.git` Is rather high up in the directory structure I had to get creative. First, I changed the prepare script to:

```json
"prepare": "cd ../.. && husky full_app/frontend/.husky"
```

Then I also had to edit the hooks in `.husky/pre-commit` to work properly. For example, this worked

```sh
npm run lint --prefix full_app/frontend
```

All a bit awkward, but it is the type of thing you do once and then it should just always work. There are no pre-made hooks for you in this case really, you just add commands you want to run on each commit in the `.husky/pre-commit` file.

### Prettier

It's Black, but for JS.

```sh
npm install --save-dev --save-exact prettier
```

You then need two config scripts:

```sh
touch .prettierrc & touch .prettierignore
```

`.prettierrc` is left empty rather bizarrely, but it's required to inform other tools that prettier is here and wants to do stuff. `.prettierignore` is naturally the files not to change.

To then run prettier do the following

```sh
npx prettier . --write
```

To add to husky, I have done it as another script, although prettier has done something else that will only prettier the staged files. I expect I will run it on everything.

```json
"prettier": "prettier . --write --ignore-unknown"
```

### lint-staged

Husky was part one of this, that allows for scripts to be ran on git actions.

lint-staged goes a bit further and then allows us to run commands on the staged code only.

This way, we don't have to run loads of commands on code that has not changed. In this spirit, I have rolled up both eslint and prettier into lint-staged, which is then ran by Husky as follows.

1. `npm install --save-dev lint-staged`
2. Change `.husky/pre-commit` to just

```sh
#!/usr/bin/env sh
. "$(dirname "$0")/_/husky.sh"
npx lint-staged
```

3. Add the scripts you want to run on staged files in the package.json as follows

```json
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "npm run prettier --prefix full_app/frontend",
      "npm run lint --prefix full_app/frontend"
    ]
  },
```

Naturally, if you wanted a program to run on everything each time, then you can add that back into the `.husky/pre-commit` file. If you wanted to emulate what pre-commit does but with --all-files parameter then probably best making a custom script in the `"scripts"` section of the `package.json`.

### Testing - Vitest

[Documentation](https://vitest.dev/guide/)

```sh
npm i vitest --save-dev
```

From there it is as you would mostly expect. I have mimicked what I would do in Python. That being there is a test directory in the top level which imports active code from src.

The test files need to have the extension `.test.ts` to work.

Finally, given that I have used Vitest and not Jest, the config can be altered in the `test` key in the `vite.config.ts` file.

The one bit I will add extra context on was I had to add `/// <reference types="vitest" />` to the top of the file in order for the `test` key to be recognized. Further information on that [here](https://www.typescriptlang.org/docs/handbook/triple-slash-directives.html).

A fun extra I subsequently found was you can install `@vitest/coverage-v8` and then run `npm run test:coverage` which will run `vitest --coverage`. This gives a cool visual on what code is actually being covered by tests.

Testing is a beast of a topic and there are many things you can do with this library and it links to several other tools that you can take advantage of. For now, we have established a starting place. The next step is how I would test components them selves.

I ended up having to rely on `https://vitest.dev/api/` and installing and using

```sh
npm i -D "@testing-library/react"
```

Example included in `tests/components/`.

Other testing libraries:

1. Cypress
2. Jest
3. HappyDom
4. JSdom

As per usual, there are far too many options which has made this a bit of a challenge to sort through. The one downside with the UI testing I have here is that it's react only. Cypress would be more versatile, but honestly a deeper dive is needed to find which would suit me best.

Also a point worth stressing, there are tools for testing typescript code, and tools for testing the DOM. They are not the same thing, hence why a solid combination of tools is likely the end goal.

### TailwindCSS

People don't like CSS. Turns out I am not the only one who struggles to get it to work out. TailwindCSS effectively adds a bunch of classes that you can use as your defaults rather than trying to do everything on your own.

Installing:

1. installing and initializing:

```sh
npm i -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

2. Altering the `tailwind.config.js` file to

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

3. Adding the following to a `src/styles/index.css` file

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

4. Finally, make sure the index.html includes the CSS made by tailwind by adding the following to the head.

```html
<link rel="stylesheet" href="src/styles/index.css" />
```

## Others

These were two points I had in the tooling section.

1. State management ([Redux](https://redux.js.org/introduction/getting-started)/[Recoil](https://recoiljs.org/docs/introduction/motivation)) 
2. Querying, why not just use fetch?

However, these are concepts that need a lot more work in react to actually get a proper handle on. The prop system first needs to be learnt in order to appreciate why State management tools are useful, and I need to actually understand the fetch command from JS to understand why there are many other querying tools that have sprung up.

The tooling is largely in place now.

We have:

1. CSS tooling to make life easier to style.
2. Linting twice over in both prettier and eslint. Prettier is for styling, ESlinter will identify problems.
3. Husky/pre-commit hooks.
4. Babel through Vite.
5. Testing through Vitest.

So we have clean code, following sensible conventions, backwards compatibility, and the tools to add robustness through testing.

From here on in, it's more learning how to do good react and TS which is a completely different set of questions and research so not something to be covered here. Plus, I could do with a break from this now, I may jump over to the server side and start to lay down the architecture of Python -> A compiled language where we can move ONNX models across.
