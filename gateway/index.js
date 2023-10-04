const { ApolloServer } =  require("@apollo/server");
const { startStandaloneServer } = require('@apollo/server/standalone');
const { ApolloGateway, IntrospectAndCompose }= require("@apollo/gateway");
const {serializeQueryPlan} = require('@apollo/query-planner');

const gateway = new ApolloGateway({
    supergraphSdl: new IntrospectAndCompose({
        subgraphs: [
            { name: "old-book-subgraph", url: "http://localhost:4001/graphql" },
            { name: "new-book-subgraph", url: "http://localhost:4002/graphql" },
            { name: "author-subgraph", url: "http://localhost:4003/graphql" },
            // { name: "old-book-subgraph-provides", url: "http://localhost:4004/graphql" }, // TODO uncomment this and comment out line 9 to test @provides
        ],
    }),
    experimental_didResolveQueryPlan: function(options) {
        if (options.requestContext.operationName !== 'IntrospectionQuery') {
            console.log(serializeQueryPlan(options.queryPlan));
        }
    }
});

const server = new ApolloServer({ gateway });

const init = async() => {
    const { url } = await startStandaloneServer(server, {
        listen: {
            port: 5000
        }
    });
    console.log(`🚀  Server ready at ${url}`);
}

init();