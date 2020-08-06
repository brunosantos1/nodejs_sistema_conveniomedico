
import contratacaoService from "@/services/api-contratacao";
export default {
  data() {
    return {
      body: {},
      loading: false
    }
  },
  computed: {

  },
  watch: {

  },
  methods: {
    async next(state, endpoint) {
      try {
        //Valida formulário
        const isValid = await this.$refs.myForm.validate();
        if (!isValid) return this.alertWarningGeneric("Preencha os campos corretamente");
        await this.processed();

      } catch (error) {
        this.alertErrorGeneric(error.message || error);
      }
    },
    async nextTemplate(state, endpoint) {
      try {
        await this.processed();

      } catch (error) {
        this.alertErrorGeneric(error.message || error);
      }
    },
    async processed() {
      try {
        if (this.loading) return;
        this.loading = true;
        const formData = this.$store.state["Contratacao"].formData;

        const body = {
          cpf: this.$store.state["Contratacao"].dadosContratacao.titular.cpf,
          nrProposta: this.$store.state["Contratacao"].dadosContratacao.proposta.nrProposta,
          sequencia: this.formStage.current ? this.formStage.current : 1,
          enderecoCobranca: this.enderecoCobranca,
          campos: formData
        }
        await contratacaoService.update(body)
        //Verifica se a próxima etapa é condicionada. Se for, pula.
        let isIgnore = this.ignoreStage(
          JSON.parse(JSON.stringify(formData)),
          this.formStage.current,
          this.formStage.current + 1
        );
        if (isIgnore) {
          let current = this.formStage.current + 2;
          this.$store.commit("Contratacao/updateStageForm", (current));
          await contratacaoService.updateSequencia({
            nrProposta: this.$store.state["Contratacao"].dadosContratacao.proposta.nrProposta,
            sequencia: current
          })
        }
        else {
          let current = this.formStage.current + 1;
          let newCurrent = this.nextIsRedirect(current);
          this.$store.commit("Contratacao/updateStageForm", (current));
          await contratacaoService.updateSequencia({
            nrProposta: this.$store.state["Contratacao"].dadosContratacao.proposta.nrProposta,
            sequencia: newCurrent
          })
        }
        this.loading = false;
      } catch (error) {
        this.loading = false;
      }
    },
    async back() {
      //Verifica se a próxima etapa é condicionada. Se for, pula.
      const formData = this.$store.state["Contratacao"].formData;
      let isIgnore = this.ignoreStage(
        JSON.parse(JSON.stringify(formData)),
        this.formStage.current - 2,
        this.formStage.current - 1
      );
      if (this.formStage.current - 1 < 1) {
        this.$store.commit("Contratacao/updateStageForm", 1);
        return this.$router.back();
      }
      if (isIgnore)
        this.$store.commit("Contratacao/updateStageForm", (this.formStage.current - 2));
      else {
        let newCurrente = this.prevIsCondition(formData, this.formStage.current - 1)
        this.$store.commit("Contratacao/updateStageForm", (newCurrente));
      }
    },
    formatBody(data) {
      let body = {};
      if (!this.formStage.current) return {};
      let formModel = data[this.formStage.current];
      for (let el in formModel) {

        for (let index = 0; index < formModel[el].length; index++) {
          const field = formModel[el][index];
          if (!Array.isArray(field)) {
            if (field && field.name && (typeof field.value !== 'object' && field.value.constructor != Object))
              body[field.name] = field.value;
            else {
              if (field && field.name && field.type == 'select')
                body[field.name] = field.value.code;
            }
          }
          else {
            body[el] = [];
            for (let index = 0; index < formModel[el].length; index++) {
              const arr = formModel[el][index];
              let obj = {};
              for (let index2 = 0; index2 < arr.fields.length; index2++) {
                const field = arr.fields[index2];
                if (field && field.name)
                  obj[field.name] = field.value;
              }
              body[el].push(obj)
            }
          }
        }
      }
      body['enderecoCobranca'] = this.enderecoCobranca;
      return body;
    },
    isValidDate(d) {
      d = new Date(d.split("/")
        .reverse()
        .join(","));
      return d instanceof Date && !isNaN(d);
    },
    alertEnderecoNaoEncontrado() {
      this.$swal({
        title: "Atenção",
        text: "Não encontramos um endereço para o cep informado.",
        type: "warning"
      });
    },
    alertCepIgualResidencial(tipoEndereco) {
      this.$swal({
        title: "Atenção",
        text: `O número de CEP informado é igual ao do endereço ${tipoEndereco} .`,
        type: "warning"
      });
    },
    alertCepInvalido() {
      this.$swal({
        title: "Atenção",
        text:
          "Este cep não atende ao plano escolhido. Se deseja utilizar este cep, será necessário uma nova simulação",
        type: "warning",
        footer: '<a href="/">Deseja realizar uma nova simulação?</a>'
      });
    },
    alertCepValido() {
      this.$swal({
        toast: true,
        type: "success",
        position: "top-end",
        showConfirmButton: false,
        title: "Cep válido para o plano escolhido",
        timer: 5000
      });
    },
    alertCpfIgualTitular() {
      return this.$swal({
        title: "Atenção",
        text: `O CPF do responsável não pode ser o mesmo que do titular em questão.`,
        type: "warning",
        confirmButtonText: "OK",
        allowOutsideClick: false
      });
    },
    alertAlteraDependente() {
      return this.$swal({
        title: "<strong>Atenção</strong>",
        type: "info",
        html: "Adicionar ou remover dependentes pode refletir no preço final",
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: "Confirmar",
        cancelButtonText: "Cancelar",
        allowOutsideClick: false
      });
    },
    alertEmancipado() {
      return this.$swal({
        title: "<strong>Atenção</strong>",
        type: "info",
        html: "Neste caso, solicitaremos posteriormente o documento comprobatório de emancipação"
      });
    },
    alertPossuiPlano() {
      return this.$swal({
        title: "<strong>Atenção</strong>",
        type: "info",
        html: "Neste caso, solicitaremos posteriormente a CTP (Carta de Tempo de Permanência)"
      });
    },
    alertWarningGeneric(msg) {
      this.$swal({
        toast: true,
        type: "warning",
        position: "top-end",
        showConfirmButton: false,
        title: msg,
        timer: 5000
      });
    },
    alertErrorGeneric(msg) {
      this.$swal({
        toast: true,
        type: "error",
        position: "top-end",
        showConfirmButton: false,
        title: msg,
        timer: 5000
      });
    },
    ignoreStage(formData, current, nextPrev) {
      //Método responsável por validar se o próxima/anterior stage(etapa) é ignorado
      let ignore = 0;
      let stageActive = null;
      if (current < 1 || nextPrev < 1) return 0
      if (formData) {
        stageActive = this.stages.find(
          e => e.sequencia == nextPrev
        );
        const active = formData[current];
        for (let el in active) {
          if (Array.isArray(active[el])) {
            for (let index = 0; index < active[el].length; index++) {
              const f = active[el][index];
              if (stageActive && stageActive.condicao) {
                stageActive.condicao.forEach(cond => {
                  if (f.name == cond.name) {
                    if (f.value != cond.value) {
                      ignore++;
                    }
                  }
                })
              }
            }
          }
        }
      }
      if (ignore) {
        stageActive.formularios.forEach(form => {
          this.$store.commit("Contratacao/removeStoreFields", {
            nextPrev: nextPrev,
            modelName: form.model
          });
        });
      }
      return ignore;
    },
    nextIsRedirect(next) {
      const stageActive = this.stages.find(
        e => e.sequencia == next
      );
      if (stageActive.redirecionamento) {
        next--;
      }

      return next;
    },
    prevIsCondition(formData, prev) {
      const stageActive = this.stages.find(
        e => e.sequencia == prev
      );
      if (!formData[prev] && stageActive && stageActive.condicao && stageActive.condicao.length > 0) {
        prev--;
      }

      return prev;
    }
  }
}