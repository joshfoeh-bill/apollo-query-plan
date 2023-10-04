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
    newQuery: Book
}

type Book @key(fields: "id") {
    id: ID!
    newField: String
    authorId: String @inaccessible @shareable
}
`;

const resolvers = {
    Query: {
        newQuery: () => {
            return {
                id: "1",
                newField: "NEW",
                authorId: "author-1"
            }
        },
    },
    Book: {
        __resolveReference: () => {
            return {
                id: "1",
                newField: "NEW",
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
        listen: { port: 4002 },
    });

    console.log(`🚀  Server ready at: ${url}`);
};

init();