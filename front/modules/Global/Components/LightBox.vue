<template>
  <transition name="fade" mode="in-out">
    <div class="light-box" v-if="isShow">
      <div class="btn-close" @click="close">
        <span class="fi-x"></span>
      </div>

      <div class="content">
        <h1 class="text-center title">{{title}}</h1>
        <img class="image" v-bind:src="image" />
      </div>
    </div>
  </transition>
</template>

<style scoped lang="scss">
.light-box {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: #000000c7;
  z-index: 99;
  .btn-close {
    position: fixed;
    top: 5px;
    right: 5px;
    color: #fff;
    cursor: pointer;
    z-index: 100;
    padding: 10px 30px;
  }
  .content {
    position: fixed;
    left: 50%;
    top: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    color: #fff;

    .title {
      margin-bottom: 30px;
    }
    .image {
      max-width: 100%;
    }
  }
}

.fade-enter-active {
  transition: all 0.3s ease;
}
.fade-leave-active {
  overflow: hidden;
  transition: opacity 0.5s;
}
.fade-enter {
  opacity: 0;
}
.fade-leave-to {
  opacity: 0;
}
</style>

<script>
export default {
  name: "LightBox",
  mixins: [],
  props: {},
  components: {},
  data() {
    return {
      image: "",
      title: "",
      isShow: false
    };
  },
  computed: {},
  async created() {},
  methods: {
    show(src, title) {
      this.image = src;
      this.title = title ? title : "";
      this.isShow = true;
    },
    close() {
      this.isShow = false;
      this.image = "";
    }
  }
};
</script>