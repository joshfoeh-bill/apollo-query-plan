const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const { buildSubgraphSchema } = require('@apollo/subgraph');
const gql = require('graphql-tag');


const typeDefs = gql`

extend schema
@link(
    url: "https://specs.apollo.dev/federation/v2.0"
    import: ["@key", "@requires", "@external"]
)

type Book @key(fields: "id") {
    id: ID!
    authorId: String @external
    author: Author @requires(fields: "authorId")
}

type Author {
    id: ID!
    name: String
}
`;

const resolvers = {
    Query: {
        oldQuery: () => {
            return {
                id: "1",
                oldField: "OLD",
                authorId: "author-1"
            }
        },
    },
    Book: {
        __resolveReference: () => {
            return {
                id: "1",
                author: {
                    id: "author-1",
                    name: "Author name"
                }
            }
        }
    }
};

const server = new ApolloServer({
    schema: buildSubgraphSchema({ typeDefs, resolvers }),
});

const init = async () => {
    const { url } = await startStandaloneServer(server, {
        listen: { port: 4003 },
    });

    console.log(`🚀  Server ready at: ${url}`);
};

init();