import express from "express"; 

const port: number = 5050;
const app: express.Application = express();

app.get(
    "/api/something",
    (_req: express.Request, res: express.Response) => res.send(
        JSON.stringify({"message": "Hello World!"})
    ),
);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));