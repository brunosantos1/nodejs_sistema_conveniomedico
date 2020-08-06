<template>
  <span v-if="mask">

    <div class="input-group input-bootstrap" v-if="bootstrapStyle">
         <the-mask  
            ref='inputComponent'
             
            :name="name"
            :type="type" 
            :placeholder="placeholder"
            :mask="maskComputed"
            :value="value"
            v-model="maskedValue"
            class="form-control"
            :masked="true"
            @input="$emit('input', maskedValue)"
          />                  
      <div class="input-group-append">
        <button @click.prevent="$emit('deleteItem')" class="btn btn-outline-danger" type="button">Remover</button>
      </div>
    </div>



    <the-mask  
      ref='inputComponent'
      :name="name"
      :type="type" 
      :placeholder="placeholder"
      :mask="maskComputed"
      :value="value"
      v-model="maskedValue"
      :masked="true"
      @input="$emit('input', maskedValue)"
      v-else
    />
    
    

  </span>
  <span v-else>

    <div class="input-group input-bootstrap" v-if="bootstrapStyle">
         <input 
          ref='inputComponent'
          :name="name"
          :type="type" 
          :placeholder="placeholder"
          :maxlength="maxlength"
          :value="value"
          @input="$emit('input', $event.target.value)"
          >
      <div class="input-group-append">
        <button @click.prevent="$emit('deleteItem')" class="btn btn-outline-danger" type="button">Remover</button>
      </div>
    </div>


    <input
      v-else
      ref='inputComponent'
      :name="name"
      :type="type" 
      :placeholder="placeholder"
      :maxlength="maxlength"
      :value="value"
      @input="$emit('input', $event.target.value)">


  </span>
</template>

<script>
  
  import {mask} from 'vue-the-mask'
  import {TheMask} from 'vue-the-mask'

  export default {
    data(){
      return {
        maskedValue: ''
      }
    },
    mounted(){
      // console.log("oimeu valoreh",this.value);
      var element1 = this.$refs.inputComponent
      setTimeout(function(){
        if(element1.$el) {
          element1.$el.focus()
        } else {
          element1.focus()
        }
        },300);
      //this.$refs.inputComponent.focus()
      if (typeof(this.value) !== "object") {
        this.maskedValue = this.value;
      }
      if(this.value){
        // console.log(this.name)
        this.$validator.validate(this.name)
      }
    },
    components: {
      TheMask
    },
    directives: {
      mask
    },
    props: ['placeholder', 'type', 'repeatable', 'min', 'maxlength', 'mask', 'name', "value", "bootstrapStyle"],
    computed: {
      maskComputed() {
        if (this.name === "telefone") {
          return ['(##) ####-####', '(##) #####-####'];
        } else {
          return this.mask;
        }
      }
    }
  }
</script>