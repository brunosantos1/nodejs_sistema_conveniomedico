<template>
  <div class="w-100">
    <!-- area de icone -->
    <div class="icon-container d-flex justify-content-center">
      <div class="icon-size text-center my-5">
        <div v-html="this.source.icon"></div>
      </div>
    </div>
    <!-- area do titulo e da descricao -->
    <h1> {{ this.source.titulo }} </h1>
    <p  class="mt-3"> {{ this.source.descricao }} </p>
  </div>
</template>

<style lang="scss">

  .rounded {
    border-radius: 50%;
  }

  .icon-size {
    width: 100px;
    height: 100px;
  }

  .icon-container {
    text-align: center;
  }

</style>

<script>

export default {
  name : "PageDescritivo",
  components : {},
  props : {
    "source" : {
      type : Object,
      default : function(){
        return {};
      }
    }
  },
  data: function(){ return {} },
  methods : {},
  computed : {},
  created : function(){
    if(!this.source.hasOwnProperty("titulo") || !this.source.hasOwnProperty( "descricao" )){
      throw "Objeto 'source' não possui propriedade titulo ou descricao";
    }
    console.log( "Created --> PageDescritivo ..." );
  },
  mounted : function(){
    console.log( "Moutend --> PageDescritivo ..." );
  }
}

</script>