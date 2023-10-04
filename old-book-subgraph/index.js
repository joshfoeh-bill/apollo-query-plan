const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const { buildSubgraphSchema } = require('@apollo/subgraph');
const gql = require('graphql-tag');


const typeDefs = gql`

extend schema
@link(
    url: "https://specs.apollo.dev/federation/v2.0"
    import: ["@key", "@shareable", "@inaccessible"]
)

type Query {
    oldQuery: Book
}

type Book @key(fields: "id") {
    id: ID!
    oldField: String
    authorId: String @inaccessible @shareable
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
                oldField: "OLD",
                authorId: "author-1"
            }
        }
    }
};

const server = new ApolloServer({
    schema: buildSubgraphSchema({ typeDefs, resolvers }),
});

const init = async () => {
    const { url } = await startStandaloneServer(server, {
        listen: { port: 4001 },
    });

    console.log(`🚀  Server ready at: ${url}`);
};

init();