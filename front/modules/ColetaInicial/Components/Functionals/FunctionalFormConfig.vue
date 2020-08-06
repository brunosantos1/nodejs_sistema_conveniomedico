<script>
  // Services
  import questoesService from "@/services/api-parametriza-tela";
  import questionsJSON from '@/modules/ColetaInicial/questions.json';
  import FormWrapper from '@/modules/ColetaInicial/Components/FormWrapper.vue';

  const COMPONENT_MAP = {
    checkbox: 'Checkbox',
    radio: 'Radio',
    text: 'InputText',
    email: 'InputText',
    number: 'InputText',
    datepicker: 'Datepicker',
    select: 'Select',
    range: 'Range',
    autocomplete: 'Autocomplete',
    repeatable: 'Repeatable'
  };

  async function listarQuestoes() {
    const response = await questoesService.getTelaEspecifica("Cadastro", "ColetaDados");
    let qs = response.data[0].ColetaDados.sort((a, b) => a.Order - b.Order);
    // let qs = response.data[0].ColetaDados;
    let childItens = [];
    // Loopa para traduzir os inputs em components
    if (qs) {
      for (var i = 0; i < qs.length; i++) {
        let item = qs[i];
        let component = COMPONENT_MAP[item.type];
        qs[i] = {...item, component};
        // Checa se existe um parent para referenciar mais tarde
        if (qs[i].parent) {
          childItens.push({
            parentID: i,
            child: qs[i]
          });
        }
      }
      // 
      // 
      // PARA RESOLVER
      // 
      // 
      // loopa pelo json e importa aquilo que não está no banco ainda
      qs = qs.filter( (item) => {
        const qJSON = questionsJSON.filter( (itemJSON) => {
          if (itemJSON.name === item.name) {
            return itemJSON;
          } else if (item.childs) {
            const childItemFiltered = item.childs.filter( (childItem) => {
               if (itemJSON.name === childItem.name) {
                return itemJSON;
               }
            });
          }
        });
        return Object.assign(item, qJSON[0]);
      });
    }
    // Agora loopa a array de childItens e insere na array
    // principal dentro da propriedade "childs" 
    // e apaga do primeiro nível da mesma array esta entrada
    // e depois apaga a variavel
    if (childItens.length > 0 ) {
      for (var c = 0; c < childItens.length; c++) {
        // Se o tipo do input for repeatable, checa a propriedade
        // Repeatable fields
        if (childItens[c].child.type === "repeatable") {
          let item = childItens[c].child.options.attrs.repeatableFields;
          let component = COMPONENT_MAP[item.type];
          childItens[c].child.options.attrs.repeatableFields = {...item, component};
        }
        // loopa pelo pai, adicionando os filhos de acorco om o index.
        const qsParent = qs.filter((item, index) => {
          if (item.name === childItens[c].child.parent) {
            item.index = index;
            return item;
          }
        });

        if (qs[qsParent[0].index].childs) {
          qs[qsParent[0].index].childs.push(childItens[c].child);
        } else {
          qs[qsParent[0].index].childs = [childItens[c].child];
        }
        qs.splice(childItens[c].parentID, 1);
        childItens.splice(childItens[c], 1);
      }
    };
    return qs;
  };

  export default {
    functional: true,
    render(createElement, context) {
      const questions = listarQuestoes();
      return createElement(FormWrapper, {
        props: {
          formFields: questions 
        }
      });
    }
  }
</script>