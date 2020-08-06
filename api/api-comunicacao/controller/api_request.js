var axios = require("axios");
const { configEnvio } = require("./api_config.js");

exports.sendSMSPlusoft = async function (xml) {
  try {
    var params = {}
    params.soapaction = configEnvio.sms.urlEnviaMensagemAction;
    params.url = configEnvio.sms.urlEnviaMensagemServico;
    params.contentType = 'application/soap+xml;charset=UTF-8;';
    params.xml = xml;
    var ret = await sendData(params);
    return ret;
  } catch (error) {
    throw error
  }
};

const sendData = async params => {
  try {
    const headers = {
      'Content-Type': params.contentType,
      'SOAPAction': params.soapaction
    }
    await axios.post(params.url, params.xml, {
      headers: headers
    });
  } catch (error) {
    throw {
      message: error.message,
      statusText: error.response.statusText
    }
  }
};