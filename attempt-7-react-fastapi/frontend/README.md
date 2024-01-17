
```console
npm install
npm run dev
```
This will start a server running on `http://localhost:8080/`. Open a browser to this adress to access the frontend app.

## Building the application

To build the application for production, run

```console
npm run build
```

This will compile and process the application's source files into the `dist` directory, which can then be served by an http server.

## Linting and formatting

To lint the frontend code, run

```console
npm run lint
```

To format the code, run

```console
npm run format
```

**Note** in order to configure eslint to work properly with VScode, you should set the working directory in your workspace config (open settings with `cmd + ,` and search for `eslint working` ):

```
"eslint.workingDirectories": [
    "./frontend"
]
```
