<template>
  <div id="app">
    <div class="container-fluid">
      <div class="row">
        <router-view/>
      </div>
    </div>
    <TextoChat></TextoChat>
  </div>
</template>

<script>
import TextoChat from '@/modules/Global/Components/TextoChat'
export default {
  components:{TextoChat},
}
</script>