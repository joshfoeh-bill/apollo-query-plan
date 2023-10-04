# Running

cd into each subgraph directory and `npm install` `npm start`.

Once each subgraph is running cd into the gateway directory and `npm install` `npm start`.

# Testing

Make the following request to http://localhost:5000/graphql

```gql
query TestOldQuery {
    oldQuery {
        id
        oldField
        author { 
            id
            name
         }
    }
}
```

# Expected behavior

Since all required fields in the query can be resolved by the `old-book-subgraph` and the `author-subgraph` we should 
see the query plan only include those two subgraphs.

# Actual behavior

The query plan includes the `new-book-subgraph` which is not required to resolve the query. It fetches the `authorId` 
from the `new-book-subgraph` even though it could be resolved by the `old-book-subgraph`.

```
QueryPlan {
  Sequence {
    Fetch(service: "old-book-subgraph") {
      {
        oldQuery {
          __typename
          id
          oldField
        }
      }
    },
    Flatten(path: "oldQuery") {
      Fetch(service: "new-book-subgraph") {
        {
          ... on Book {
            __typename
            id
          }
        } =>
        {
          ... on Book {
            authorId
          }
        }
      },
    },
    Flatten(path: "oldQuery") {
      Fetch(service: "author-subgraph") {
        {
          ... on Book {
            __typename
            authorId
            id
          }
        } =>
        {
          ... on Book {
            author {
              id
              name
            }
          }
        }
      },
    },
  },
}
```

*Note:* If `newQuery` is used as the entrypoint instead then the query plan only includes the `new-book-subgraph` and `author-subgraph` as expected.

```
query TestNewQuery {
    newQuery {
        id
        newField
        author { 
            id
            name
         }
    }
}
```
