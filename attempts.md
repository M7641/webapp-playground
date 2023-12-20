
## Attempt One - nextjs-fastapi

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
1. https://tms-dev-blog.com/python-backend-with-javascript-frontend-how-to/
2. https://testdriven.io/blog/developing-a-single-page-app-with-fastapi-and-vuejs/ - Single page though.
3. https://saashammer.com/blog/how-to-combine-frontend-and-backend-for-python-web-developers/ 
4. https://bun.sh/guides/ecosystem/nextjs
5. https://joshmo.hashnode.dev/deploying-a-nextjs-front-end-with-a-rust-api-in-one-go
6. https://dev.to/francescoxx/build-a-full-stack-app-with-rust-nextjs-and-docker-436h with https://dev.to/francescoxx/build-a-full-stack-app-with-rust-nextjs-and-docker-436h as the code

Keep the aim in mind:
I want the best possible front end that can use any back end with relative ease. 
It does seem like they need to be kept apart as the tech seems to be a bit too hard.
Might be worth trying the proxy server, but just seeing how much of a pain the Dedicated API route will be the most certain solution.
It won't be a massive pain as long as the URL does not change too much.