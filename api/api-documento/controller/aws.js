const AWS = require('aws-sdk');
const fs = require('fs');
const proxy = require('proxy-agent');
//const delay = require('delay');
//const saveSync = require('save-file');
//const del = require('delete');
const queries = require('./api_cql');
const config = require('./api_config.js');
const neo4j = require('neo4j-driver').v1;


exports.MergeArquivoAWS = async function (req, res, next) {
    try {
        var requisicao = req.body;
        if (typeof requisicao === 'string')
            requisicao = JSON.parse(requisicao);

        let url = await module.exports.Merge(requisicao);
        req.body.url = url;
        next();
    }
    catch (erro) {
        var msg = erro.message || erro;
        res.send(400, { message: msg });
    }
}

exports.Merge = async function (requisicao) {
    try {
        let tipoDocumento = requisicao.tipoDocumento.toLowerCase();
        let proposta = requisicao.nrProposta;
        let identificador = requisicao.identificador;
        let arquivoStream = requisicao.arquivoStream;
        let extensao = requisicao.extensao ? requisicao.extensao.toLowerCase() : ".png";
        let frenteVerso = requisicao.frenteVerso ? requisicao.frenteVerso.toLowerCase() : null;

        let permissoes = await buscarPermissoes();
        if (permissoes) {

            let delimitadorDocumento;

            delimitadorDocumento = "propostas" + '/' + proposta + '/' + tipoDocumento + '/';

            let caminho = delimitadorDocumento;
            let NomeArquivo = identificador + (frenteVerso ? "_" + frenteVerso : "") + extensao;
            let arquivo = arquivoStream;
            let caminhoCompleto = caminho + NomeArquivo

            const ss3 = new AWS.S3({
                accessKeyId: permissoes.AccessKeyId,
                secretAccessKey: permissoes.SecretAccessKey,
                httpOptions: {
                    //agent: proxy('http://10.100.1.141:8080') //SOMENTE PARA TESTE LOCAL
                }
            });

            if (caminho && arquivo && NomeArquivo) {

                let buff = Buffer.from(arquivo, 'base64');
                let tempDir = '../../../../temp/';
                let filename = tempDir;
                // saveSync(buff, 'temp/' + NomeArquivo);
                // await delay(1000);
                if (!fs.existsSync(tempDir)) {
                    fs.mkdirSync(tempDir);
                }
                filename = filename + NomeArquivo;
                fs.writeFileSync(filename, buff);
                const params = {
                    Bucket: permissoes.Bucket, // pass your bucket name
                    Key: caminhoCompleto,
                    Body: fs.createReadStream(filename)
                };

                const promiseFn = () => {
                    return new Promise((resolve, reject) => {
                        ss3.putObject(params, function (s3Err, data) {

                            if (s3Err) {
                                reject(new Error(s3Err));
                            }
                            else {
                                fs.unlinkSync(filename);
                                resolve(caminhoCompleto);
                            }

                        })
                    })
                }

                let result = await promiseFn();
                return result;
            }
            else {
                throw 'Erro ao processar arquivo';
            }
        }
    }
    catch (err) {
        throw err;
    }
}

exports.VisualizarArquivoAWS = async function (req, res, next) {
    try {
        var requisicao = req.body;
        if (typeof requisicao === 'string')
            requisicao = JSON.parse(requisicao);

        let path = requisicao.path;

        let permissoes = await buscarPermissoes();
        if (permissoes) {

            const ss3 = new AWS.S3({
                accessKeyId: permissoes.AccessKeyId,
                secretAccessKey: permissoes.SecretAccessKey,
                httpOptions: {
                    //agent: proxy('http://10.100.1.141:8080')
                }
            });


            ss3.getSignedUrl('getObject', {
                Bucket: permissoes.Bucket,
                Key: path
            }, function (err, url) {
                if (err) {
                    var msg = 'Erro ao carregar arquivo';
                    res.send(400, { message: msg });
                }
                else {
                    res.send(200, url)
                }
            });
        }
    }
    catch (erro) {
        var msg = erro.message || erro;
        res.send(400, { message: msg });
    }
}
exports.VisualizarArquivoPropostaAWS = async function (req, res, next) {
    try {
        var requisicao = req.body;
        if (typeof requisicao === 'string')
            requisicao = JSON.parse(requisicao);


        let doc = await buscarDocumento(requisicao);

        let permissoes = await buscarPermissoes();
        if (permissoes && doc && doc.url) {

            const ss3 = new AWS.S3({
                accessKeyId: permissoes.AccessKeyId,
                secretAccessKey: permissoes.SecretAccessKey,
                httpOptions: {
                    //agent: proxy('http://10.100.1.141:8080')
                }
            });


            ss3.getSignedUrl('getObject', {
                Bucket: permissoes.Bucket,
                Key: doc.url
            }, function (err, url) {
                if (err) {
                    var msg = 'Erro ao carregar arquivo';
                    res.send(400, { message: msg });
                }
                else {
                    res.send(200, url)
                }
            });
        }
        else {
            res.send(200, "")
        }
    }
    catch (erro) {
        var msg = erro.message || erro;
        res.send(400, { message: msg });
    }
}

exports.VisualizarArquivoPropostaDetalheAWS = async function (req, res, next) {
    try {
        var requisicao = req.body;
        if (typeof requisicao === 'string')
            requisicao = JSON.parse(requisicao);


        let doc = await buscarDocumento(requisicao);

        let permissoes = await buscarPermissoes();
        if (permissoes && doc && doc.url) {

            const ss3 = new AWS.S3({
                accessKeyId: permissoes.AccessKeyId,
                secretAccessKey: permissoes.SecretAccessKey,
                httpOptions: {
                   // agent: proxy('http://10.100.1.141:8080')
                }
            });


            ss3.getSignedUrl('getObject', {
                Bucket: permissoes.Bucket,
                Key: doc.url
            }, function (err, url) {
                if (err) {
                    var msg = 'Erro ao carregar arquivo';
                    res.send(400, { message: msg });
                }
                else {
                    requisicao.url = url;
                    res.send(200, requisicao)
                }
            });
        }
        else {
            res.send(200, "")
        }
    }
    catch (erro) {
        var msg = erro.message || erro;
        res.send(400, { message: msg });
    }
}

exports.DeletarArquivoAWS = async function (req, res, next) {
    try {
        var requisicao = req.body;
        if (typeof requisicao === 'string')
            requisicao = JSON.parse(requisicao);

        let doc = await buscarDocumento(requisicao);

        let permissoes = await buscarPermissoes();
        if (permissoes && doc && doc.url) {

            const ss3 = new AWS.S3({
                accessKeyId: permissoes.AccessKeyId,
                secretAccessKey: permissoes.SecretAccessKey,
                httpOptions: {
                    //  agent: proxy('http://10.100.1.141:8080')
                }
            });


            ss3.deleteObject({
                Bucket: permissoes.Bucket,
                Key: doc.url
            }, function (err, url) {
                if (err) {
                    var msg = 'Erro ao deletar arquivo no servidor';
                    res.send(400, { message: msg });
                }
                else {
                    next();
                }
            });
        }
        else {
            res.send(404, { message: 'Arquivo não encontrado' })
        }
    }
    catch (erro) {
        var msg = erro.message || erro;
        res.send(400, { message: msg });
    }
}

async function buscarPermissoes() {
    try {
        var query = queries.cql.cqlbBuscarPermissoes;
        query = query.replace('@User', config.security_api.aws_user);

        return await executeCypherAsync(query)
    }
    catch (err) {
        throw err;
    }
};

async function buscarDocumento(body) {
    try {
        var query = queries.cql.cqlbBuscarDocumento;
        query = query
            .replace('@NrProposta', body.nrProposta)
            .replace('@Identificador', body.identificador)
            .replace('@TipoDocumento', body.tipoDocumento);

        return await executeCypherAsync(query)
    }
    catch (err) {
        throw err;
    }
};

async function gravarLogs(tipoLog, caminho, Usuario, descricao, matricula, proposta) {

    try {
        var query = queries.cql.cqlGravarLog
        query = query.replace('@MATRICULA', matricula)
        query = query.replace('@PROPOSTA', proposta)
        query = query.replace('@MATRICULA1', matricula)
        query = query.replace('@PROPOSTA1', proposta)

        query = query.replace('@TIPO', tipoLog)
        query = query.replace('@CAMINHO', caminho)
        query = query.replace('@DESCRICAO', descricao)
        query = query.replace('@USUARIO', Usuario)


        await executeCypherAsync(query)
    }
    catch (err) {
        console.log(err)
    }
    return
}

async function executeCypherAsync(cql) {
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
        return null
}