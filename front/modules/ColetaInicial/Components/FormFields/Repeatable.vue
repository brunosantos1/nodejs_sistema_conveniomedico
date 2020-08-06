<template>
  <div class="repeatable-item">
    <button class="btn btn-block btn-outline-primary mb-2" type="button" @click="addInput">Adicionar Dependente</button>
     <!-- <field-label v-if="this.inputValue.length > 0">
        <strong>{{childLabel.label}}</strong>
      </field-label> -->
    <template v-for="(item, index) in inputValue">
      <div class="repeatable-field row mb-3" :key="item.uid">
        <div class="col-10" :class="{'col-12': repeatableFields.bootstrapStyle}">
          <field-label>
            <strong>{{childLabel.label}}</strong>
          </field-label>
         <component
         :is="fieldType"
         :value="item.value"
         :name="name + '_' + index"
         :data-vv-as="name + '_' + index"
         v-model="item.value"
         v-bind="{ ...repeatableFields }"
         v-validate="repeatableFields.validation"
         @input="$emit('input', inputValue)" 
         @deleteItem="deleteItem(item)"
         />
       </div>
       <div class="col-2" v-if="!repeatableFields.bootstrapStyle">
        <button class="btn-icon" @click.prevent="deleteItem(item)" title="apagar dependente">
          <Ico icon="circle-x" class="icon icon__danger" />
        </button>
      </div>
    </div>
  </template>
</div>
</template>

<style scoped lang="scss">
.repeatable-field  {
  margin-top: .5em;
}
.label-error{height:auto !important}
</style>

<script>
  // Form Fields
  import InputText from '@/modules/ColetaInicial/Components/FormFields/Input.vue';
  import Checkbox from '@/modules/ColetaInicial/Components/FormFields/Checkbox.vue';
  import Radio from '@/modules/ColetaInicial/Components/FormFields/Radio.vue';
  import Datepicker from '@/modules/ColetaInicial/Components/FormFields/Datepicker.vue';
  import Range from '@/modules/ColetaInicial/Components/FormFields/Range.vue';
  import Select from '@/modules/ColetaInicial/Components/FormFields/Select.vue';
  import Autocomplete from '@/modules/ColetaInicial/Components/FormFields/Autocomplete.vue';
  import FieldLabel from "@/modules/ColetaInicial/Components/FormElements/FormFieldLabel.vue";
  import FieldError from "@/modules/ColetaInicial/Components/FormElements/FormFieldError.vue";

  import Ico from '@/modules/Global/Components/Icon.vue';

  export default {
    name: "Repeatable",
    props: ['repeatableFields', 'name', 'value', 'childLabel'],
    data(){
      return {
        inputValue: [],
        uid: 0
      }
    },
    mounted(){
      if (this.$store.state.ColetaDados.formData[this.name].length > 0) {
        this.inputValue = this.$store.state.ColetaDados.formData[this.name];
      }
    },
    created(){
      this.addInput();
    },
    components: {
      InputText,
      Checkbox,
      Radio,
      Datepicker,
      Range,
      Select,
      Autocomplete,
      Ico,
      FieldError,
      FieldLabel
    },
    computed: {
      fieldType(){
        return this.repeatableFields.component;
      }
    },
    methods: {
      checkInput(inputValue){
        //logica
        this.$emit('checkIsValid', 'dependentes');
        this.$emit('input', inputValue);
      },
      addInput(){
        if (this.inputValue.length >= this.repeatableFields.limit) {
          return false;
        };

        let identificador = this.makeId();
        this.inputValue.push({
          id: identificador,
          value: ''
        });

        this.$validator.attach({
          name : identificador,
          alias : "Data de Nascimento",
          initialValue : '',
          persist : true,
          rules : {
            required : true
          }
        });
      },
      deleteItem(item){
        this.inputValue = this.inputValue.filter((dependente)=>{
          return dependente.id != item.id;
        });
        this.$emit("deletedValue", this.inputValue);
      },
      makeId : (function(){
        let identificador = 0;
        return function(){
          return ++identificador;
      }
      })()
    }
  }

</script>