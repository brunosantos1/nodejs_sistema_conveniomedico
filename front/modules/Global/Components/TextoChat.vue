<template>
  <span id="text-chat" v-html="texto"></span>
</template>

<script>
export default {
    data() {
        return {
            texto: "Precisa<br>de ajuda?"
        }
    },
}
</script>

<style scoped lang="scss">
    #text-chat {
        color: var(--quali-dark-blue);
        // font-weight: 'calibri';
        font-weight: bold;
        font-size: 12px;
        z-index: 20;
        line-height: 1;
        text-align: center;
        position: fixed;
        bottom: 60px;
        right: 15px;
        text-shadow: 0px 0px 0px #fff;
        @media (min-width: 992px){
            right: 10px;
            font-size: 16px;
             bottom: 90px;
             right: 30px;
        }
        @media (min-width: 1300px){
             bottom: 105px;
             right: 30px;
        }
    }
</style>