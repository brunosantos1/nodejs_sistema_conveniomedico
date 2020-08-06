const config = require("./api_config.js");
const neo4j = require("neo4j-driver").v1;

exports.neo4j = {
    executeCypherAsync: async function(cql){
        let driver = neo4j.default.driver(
            config.neo4j_driver.url_bold,
            config.neo4j_driver.auth,
            { disableLosslessIntegers: true }
          );
          let session = driver.session();
          var result = await session.run(cql, null);
        
          session.close();
          driver.close();
          if (result && result.records && result.records.length > 0 && result.records[0]._fields && result.records[0]._fields.length > 0)
            return result.records[0]._fields[0];
          else
            return {}
    }
}