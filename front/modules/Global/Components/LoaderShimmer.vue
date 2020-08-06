<template>
  <div>
    <div v-if="type == 'titleImageContentRound'">
      <div v-for="(item, index) in qtd" :key="index">
        <div class="box round shine"></div>

        <div class="list-shine">
          <div class="lines shine"></div>
          <div class="lines shine"></div>
          <div class="lines shine"></div>
        </div>
        <div class="photo round shine"></div>
        <br />
      </div>
    </div>
    <div v-if="type == 'titleTextContentRound'">
      <div v-for="(item, index) in qtd" :key="index">
        <div class="list-shine left-zero top-zero">
          <div class="lines shine"></div>
          <div class="lines shine"></div>
          <div class="lines shine"></div>
        </div>
        <div class="photo round shine"></div>
        <br />
      </div>
    </div>

    <div v-if="type == 'propostas'">
      <div class="proposta" v-for="(item, index) in qtd" :key="index">
        <div class="photo round shine"></div>
        <div class="list-shine left-zero top-zero">
          <div class="lines shine"></div>
          <div class="lines shine"></div>
          <div class="lines shine btn-back"></div>
        </div>
        <br />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.shine {
  background: #f6f7f8;
  background-image: linear-gradient(
    to right,
    #f6f7f8 0%,
    #edeef1 20%,
    #f6f7f8 40%,
    #f6f7f8 100%
  );
  background-repeat: no-repeat;
  background-size: 800px 104px;
  display: inline-block;
  position: relative;

  -webkit-animation-duration: 1s;
  -webkit-animation-fill-mode: forwards;
  -webkit-animation-iteration-count: infinite;
  -webkit-animation-name: placeholderShimmer;
  -webkit-animation-timing-function: linear;
}

.box {
  height: 90px;
  width: 92px;
  &.round {
    border-radius: 50%;
  }
}
.list-shine {
  display: inline-flex;
  flex-direction: column;
  margin-left: 25px;
  margin-top: 15px;
  vertical-align: top;
  &.left-zero {
    margin-left: 0;
  }
  &.top-zero {
    margin-top: 0;
  }
}

.lines {
  height: 10px;
  margin-top: 10px;
  width: 200px;
}

.photo {
  display: block !important;
  width: 100%;
  height: 100px;
  margin-top: 15px;
  &.round {
    border-radius: 7px;
  }
}

.proposta {
  .photo {
    width: 50%;
  }
  .list-shine {
    width: 100%;
    .lines {
      width: 100%;
      &.btn-back {
        width: 60%;
      }
    }
  }
}

@-webkit-keyframes placeholderShimmer {
  0% {
    background-position: -468px 0;
  }

  100% {
    background-position: 468px 0;
  }
}
</style>

<script>
export default {
  name: "LoaderShimmer",

  props: {
    type: {
      type: String,
      required: false,
      default: "titleImageContentRound"
    },
    qtd: {
      type: Number,
      required: false,
      default: 1
    }
  },

  watch: {},

  data() {
    return {};
  },

  computed: {},

  methods: {}
};
</script>