# webapp-playground

### Useful commands
1. docker compose -f compose.yaml up


docker compose -f docker-compose.yml up

## Attempt One

The attempt to use the nextjs-fastapi appears to be a deadend. Every working method uses the vercel severless functions.
To be honest, it did seem like I would have to expose two ports which did not appear as though it was going to work in work.

It does seem that we will have to split things up into a proper backend and front end.
This usually appears to be done using a docker compose that spins up each of the required technologies through
sperate Docker images.

[This is an example of this.](https://github.com/wcedmisten/python-nextjs-template)

Having an actual API backend and then a normal frontend which simply calls the said backend.
That above example appears to only surface one exposed port which has me confused. 
As if they are not hosted in two seperate locations. It is using a proxy that appears to be
mapping traffic so that it appears there is only one expose port.

This is way over my head this. It could be the next attempt. Or I could just have a dedicated
API that gets deployed and then you just have to copy the URL over unless its predetermined. 

List of other links to review:
1. https://tms-dev-blog.com/python-backend-with-javascript-frontend-how-to/  https://github.com/tmsdev82/basic-web-app-tutorial
2. https://testdriven.io/blog/developing-a-single-page-app-with-fastapi-and-vuejs/ - Single page though.
3. https://saashammer.com/blog/how-to-combine-frontend-and-backend-for-python-web-developers/ 
4. https://bun.sh/guides/ecosystem/nextjs
5. https://acropolium.com/blog/modern-web-app-architecture/
6. https://dev.to/francescoxx/build-a-full-stack-app-with-rust-nextjs-and-docker-436h with https://github.com/FrancescoXX/fullstack-rust-nextjs as the code

Keep the aim in mind:
I want the best possible front end that can use any back end with relative ease. 
It does seem like they need to be kept apart as the tech seems to be a bit too hard.
Might be worth trying the proxy server, but just seeing how much of a pain the Dedicated API route will be the most certain solution.
It won't be a massive pain as long as the URL does not change too much. 

## Atempt Two

My idea here is to get as close to a professional website design as possible. This should provide the most flexibility going forward.
Therfore, the first step is to find top tier examples.

It will have two seperate parts, a frontend and backend. The key question for me is how it is all hosted. Most 
examples that I have seen are focused on docker compose.

The frontend is sent to the browser whilst the backend remains on a server. It will always be that. Unless you don't need to provide any dynamic data.

The examlpe under python-next-tempate is working locally now.
It does raise the question on how this would work in production.

This one used 3 images. One for the backend, one for the frontend and one for the reverse proxy.
Potentially that reverse proxy is not doing much of anything and is not helping.

Let's try that one next.

## Attempt Three

This one will be the same as the previous, but with the exception that we will be going for two images and thus removing the reverse proxy.

This one is now working when you run both the backend and the frontend in two seperate terminals.
It is not the worst expeirence as it does appear there is reloading on both sides.

An idle thought, I wonder if it would be worthwhile to have docker on my mac and to build images locally just to test rather 
than having to deal with the platform. Or, just put it on a workspace.

This also now works on the docker compose. This might be the way to go then in all honesty.
The final questions are around how this would be deployed on the Peak platform. Also, to
start making this actually viable and do a good example. Another point, further enhacing the 
infrastructure side such as using expose rather than ports and removing files which are not in use.

Platform:
1. API can just be hosted as an API. 
2. Frontend is just a web app. In the webapp, the API is then using an environment variable to map to the deployed API.

That bit is the hard part as well as developer experience. If there is a predictable way to determin the API URL without having to 
build it first then it should be all round good.
Another issue in all of this is that it's not a proper deplyment, how would I put this stuff onto a cloud my self?
That is another area I should learn about to at least have the awareness. 

Are there any other attampts to be made? If Three does not work well, then there may be an idea in using docker compse inside a docker.
Which would be a mess, but it would be interesting and may be more transferable.

## Attempt four

Rust.

attempt five will be something that is not nextjs, and likley a Bun banckend or some other JS backend.
This should cover off all the use cases.
Actually a sixth could be Nextjs with it's backend functionality for basic web apps.

https://github.com/FrancescoXX/fullstack-rust-nextjs

Now working through the docker image! I have not attempted to run it locally yet.
This is due to an env error which I can fix, but I am not in a rush to do so.

## Attempt five

Full stack javascript.

https://github.com/FrancescoXX/fullstack-next-node-postgres

Thankfully, the same person who did the rust version also did the javascript version.
With this attempt, that covers most of it. Just need to worry about deployment now.

If we are to do a sixth atempt, then that would be a different frontend. I am not seeing a need to
do this at the moment as they all make and organise components. If I did one in svelt kit then I can't
see it adding loads. I should however. Just to make sure there is nothing else to address.

## Attempt Six

Astro frontend with a python backend.

Astro as it allows for any type of component, be it react, vue, or svelt. 

it's loosely working. The API is not working exactly, but all in all it is close.
And to be honest, it's not that big of a deal. Also, Astro does not have a good DX.
It's not really working with VS Code. 

The amount of front ends is a complete mess. I think it's one of those times we
go with the most popular. Or, we go for the most exessive. Quik would be good.
Maybe we should do a Single Page App as another example.

## Attempt Seven

Basic React with FastAPI. Will be good example of a basic app that might end up being the best choice in many situations.

Plus the example I got hold of appears to be rather extensive.
https://github.com/equinor/template-fastapi-react
A bit too extensive as it had authentication and plenty of other stuff.
Made it a bit too overwhelming for now.

This is the next one I will try:
https://github.com/jonasrenault/fastapi-react-mongodb-docker.git

There we go!

It is also reasonably exessive. The final step now is to actually pull together a few tamplates.
Attempt seven will be one. What ever the simple fast api and next js is, then finally the rust one.

I may just go ahead and apply it all first though in an actual app before we template anything.
Thus, start with the Medis with a nextjs front end and a fastapi backend.
