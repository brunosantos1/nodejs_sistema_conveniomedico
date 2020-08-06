var axios = require("axios");
const config = require("./api_config.js");
const queriesCql = require("./api_cql");
const neo4j = require("neo4j-driver").v1;
const circularJSON = require('circular-json');
var request = require("request")
var xml2js = require('xml2js');

exports.LoginPlusoft = async function (xml, service) {
    try {
      var params = {}
      params.soapaction = 'POST';
      params.url = config.urlAutServer + service;
      params.xml = xml;
      var ret = await getData(params);
      const parser = new xml2js.Parser();
      let result = await parser.parseStringPromise(ret); // Para utilizar parseStringPromise é necessario usar a versão "xml2js": "^0.4.22"
  
      return result;
    } catch (err) {
        return { code: 400, error: err};
    }
  };

const getData = async params => {
  const headers = {
      'Content-Type': 'text/xml',
      'SOAPAction': params.soapaction
  }

  var response = await axios.post(params.url, params.xml, {
      headers: headers
  })

  return response.data
};