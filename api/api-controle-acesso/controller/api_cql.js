exports.cql = {
  xmlAcesso: `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:aces="http://acesso.ws.modelo.autqualicorp.qualicorp.com/">
  <soapenv:Header/>
  <soapenv:Body>
    <aces:acessoPortal>
        @arg0
        @arg1
        @arg2
    </aces:acessoPortal>
  </soapenv:Body>
</soapenv:Envelope>`,

xmlEsqueciSenha: `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:esq="http://esquecisenha.ws.modelo.autqualicorp.qualicorp.com/">
   <soapenv:Header/>
   <soapenv:Body>
      <esq:esqueciSenha>
        @arg0
        @arg1
        @arg2
        @arg3
      </esq:esqueciSenha>
   </soapenv:Body>
</soapenv:Envelope>`,

xmlAlterarSenha: `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:esq="http://esquecisenhaalteracao.ws.modelo.autqualicorp.qualicorp.com/">
<soapenv:Header/>
  <soapenv:Body>
   <esq:esqueciSenhaAlteracao>
      @arg0
      @arg1
      @arg2
      @arg3
    </esq:esqueciSenhaAlteracao>
  </soapenv:Body>
</soapenv:Envelope>`,

xmlPrimeiroAcesso: `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:prim="http://primeiroacesso.ws.modelo.autqualicorp.qualicorp.com/">
<soapenv:Header/>
<soapenv:Body>
   <prim:primeiroAcesso>
     @arg0
     @arg1
     @arg2
     @arg3
     @arg4
     @arg5
     @arg6
   </prim:primeiroAcesso>
</soapenv:Body>
</soapenv:Envelope>`

};
