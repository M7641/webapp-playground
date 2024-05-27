# Data Fetching

This document could easily go no where at all, but one of the main questions I have is why not just always use fetch? Why are there so many alternatives and why did I see that fetch might be removed from React?

Libraries I have seen:

1. [Axios](https://axios-http.com/)
2. [TanStack Query / React Query](https://tanstack.com/query/v3)
3. [SWR](https://swr.vercel.app/)
4. [Apollo](https://www.apollographql.com/docs/react/)
5. [Relay](https://relay.dev/)
6. [urql](https://commerce.nearform.com/open-source/urql/docs/)
7. [Just Fetch itself](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)

[This page](https://tanstack.com/query/latest/docs/framework/react/comparison?from=reactQueryV3) is the best comparison I have seen thus far.

Answering the question as to the need for more libraries is to abstract away much of the boilerplate `fetch` leaves you with. Therefore, I probably won't truly grasp the use of these libraries without going through the pain of trying to do increasingly complicated API calls with `fetch`.

## Downsides

I should probably cut my teeth with fetch and see what the limits of it really are and using a framework will prevent me running into those experiences.

Bundle size. This is not my biggest priority, but one day it really could be and being able to use core features to their maximum means less stuff to send across the network.


## Example of the difference between using Fetch and TanStack

### Fetch

```js
import React, { useState, useEffect } from 'react';

const DataFetchingComponent = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/v1/data');
        const result = await response.json();
        setData(result);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data) return <p>No data available</p>;

  return <div>{/* Render data here */}</div>;
};

export default DataFetchingComponent;
```

### TanStack

```js
import React from 'react';
import { useQuery } from 'react-query';

const fetchData = async () => {
  const response = await fetch('/v1/data');
  const data = await response.json();
  return data;
};

const DataFetchingComponent = () => {
  const { data, isLoading, isError, error } = useQuery('data', fetchData);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {error.message}</p>;
  if (!data) return <p>No data available</p>;

  return <div>{/* Render data here */}</div>;
};

export default DataFetchingComponent;    
```

This example does show how a lot of boiler plate has been abstracted away. It is also worth saying that TanStack can do a lot more than just the fetch API could. I do certainly prefer the second variant here, but I should be able to do both.

Either way, the main answer to my initial questions is that the libraries take the core `fetch` API and wrap it up in ways that make various features easier to do.

### GraphQl

The one thing that does stick out to me is what on earth is `GraphQL`. It's a declarative version of a query. I believe this to be it's selling point. Rather than having many end points with explicit responses, a GraphQL system will have a single endpoint and you declare the data you want from it.

The language of mutations is used for creating, updating or deleting records, if it is appropriate to call them records to begin with.

Overall, think of GraphQL as an alternative to REST. 

Just to add some further context the list of popular API protocols are:

1. Representational State Transfer (REST)
2. Simple Object Access Protocol (SOAP)
3. Google Remove Procedure Call (gRCP)
4. JavaScript Object Notation-Remote Procedure Call (JSON-RPC)
5. Graph Query Language (GraphQL)
6. Apache Thrift.
