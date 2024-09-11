const {
  HuggingFaceInferenceEmbeddings,
} = require("@langchain/community/embeddings/hf");

const {
  Neo4jVectorStore,
} = require("@langchain/community/vectorstores/neo4j_vector");

/**
 * @param {import('@twilio-labs/serverless-runtime-types/types').Context} context
 * @param {{}} event
 * @param {import('@twilio-labs/serverless-runtime-types/types').ServerlessCallback} callback
 */
exports.handler = async function (context, event, callback) {
  /** @type {import('@langchain/community/vectorstores/neo4j_vector').Neo4jVectorStoreArgs} */
  const config = {
    url: "neo4j+s://989d85aa.databases.neo4j.io", // URL for the Neo4j instance
    username: "neo4j", // Username for Neo4j authentication
    password: process.env.NEO4J_PASSWORD, // Password for Neo4j authentication
    textNodeProperties: ["text"], // List of properties to use as text for the nodes
  };

  const embeddings = new HuggingFaceInferenceEmbeddings({
    apiKey: process.env.HUGGINGFACE_API_KEY, // In Node.js defaults to process.env.HUGGINGFACEHUB_API_KEY
    model: "sentence-transformers/all-MiniLM-L6-v2",
  });
  console.log("setup complete");
  console.log(await embeddings.embedQuery("security risks"));
  // You should have a populated Neo4j database to use this method
  const neo4jVectorIndex = await Neo4jVectorStore.fromExistingGraph(
    embeddings,
    config
  );

  console.log("search");

  const results = await neo4jVectorIndex.similaritySearch("security risks", 10);

  console.log(results);
  await neo4jVectorIndex.close();
  return callback(null, { results });

  /*
  [ Document { pageContent: 'Cat drinks milk', metadata: { a: 1 } } ]
*/
};
