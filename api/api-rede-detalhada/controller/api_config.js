//Método exports de configuração
//
exports.requestApi = {

  Auth: {
    url: '/oauth/access-token',
    baseUrl: 'https://apisulamerica.sensedia.com/dev/referenciada/api/v2',
    headers: {
      'Authorization': 'Basic Yjc4YTU0MGItYWVjZi0zMGFmLWE4ZTMtM2JmNzIwN2YyYmU5OjdiYzM1MzM4LTUxOTMtMzA2Yi1hMDI2LWFjNzI0ODllNTdkYQ==',
      'Content-Type': 'application/json'
    },
  },

  Send: {
    url: '/prestadores',
    baseUrl:'https://apisulamerica.sensedia.com/dev/referenciada/api/v2',
    headers: {
      Accept: 'application/json',
      client_id: 'b78a540b-aecf-30af-a8e3-3bf7207f2be9'
    }
  }
}