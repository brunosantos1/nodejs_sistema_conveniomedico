<template>
  <transition name="fade" mode="in-out">
    <div class="camera-box" :class="{'invisible': !isShow, 'visible': isShow}">
      <div v-if="isNotTake" class="btn-close" @click="close">
        <span class="fi-x"></span>
      </div>
      <div class="row justify-content-center">
        <div class="content col-12 col-sm-12 col-md-12 col-lg-8">
          <video
            :class="{'invisible': !isNotTake, 'visible': isNotTake}"
            class="player"
            :id="'player' + index"
            autoplay
          ></video>
          <canvas
            :class="{'invisible': isNotTake, 'visible': !isNotTake}"
            class="canvas"
            :id="'canvas' + index"
          ></canvas>
          <div v-if="isNotTake" class="box-options">
            <div class="btn-reverse" @click="reverseCamera()">
              <div class="fi fi-loop-circular"></div>
            </div>
            <div class="btn-primary__dark btn-capture" @click="takePicture()">
              <div class="fi fi-aperture"></div>
            </div>
            <div style="width: 90px;" class></div>
          </div>

          <div v-if="!isNotTake" class="box-options" @click="cancelTakePicture()">
            <div class="btn-reverse">
              <div class="fi fi-x danger"></div>
            </div>
            <div style="width: 90px;" class></div>
            <div class="btn-reverse" @click="okTakePicture()">
              <div class="fi fi-check success"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped lang="scss">
@import "../../../assets/css/responsive.scss";
.visible {
  display: block;
}
.invisible {
  display: none;
}
.camera-box {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: #000000f7;
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
    background-color: #000;
    height: calc(100%);
    top: 0%;
    color: #fff;
    padding: 0;
    .player,
    canvas {
      width: 100%;
      margin-top: 50px;
      background-color: #101010;
      height: calc(100% - 30%);
    }
  }

  .box-options {
    margin-top: calc(3%);
    text-align: center;
    display: flex;
    justify-content: space-between;
    margin-right: 4%;
    margin-left: 4%;

    .btn-capture {
      display: inline-block;
      width: 90px;
      height: 90px;
      border-radius: 50%;
      text-align: center;
      cursor: pointer;
      .fi,
      .fi:hover {
        font-size: 40px;
        margin-top: 21px;
        color: white;
      }
    }
    .btn-capture:hover {
      background-color: var(--quali-brand);
    }
    .btn-capture:active {
      background-color: var(--quali-medium-blue);
    }

    .btn-reverse {
      display: inline-block;
      width: 90px;
      height: 90px;
      border-radius: 50%;
      text-align: center;
      cursor: pointer;
      .fi,
      .fi:hover {
        font-size: 40px;
        margin-top: 27px;
        color: white;
        &.success {
          color: var(--teal);
        }
        &.danger {
          color: var(--danger);
        }
      }
    }

    .btn-reverse:hover {
      background-color: #101010;
    }
    .btn-reverse:active {
      background-color: #101010;
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
  name: "CameraBox",
  mixins: [],
  props: ["index", "tipoDocumento", "identificador"],
  components: {},
  data() {
    return {
      stream: "",
      isShow: false,
      modeBack: true,
      isNotTake: true
    };
  },
  computed: {},
  created() {},
  methods: {
    async show() {
      await this.loadCamera();
    },
    close() {
      this.isShow = false;
    },
    async loadCamera(isNotModeBack) {
      var player = document.getElementById("player" + this.index);
      this.isNotTake = true;

      // this.modeBack = isNotModeBack ? false : true;
      let facingMode = null;
      if (this.modeBack) {
        facingMode = { exact: "environment" };
      } else {
        facingMode = "user";
      }

      this.isShow = true;
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: facingMode } })
        .then(stream => {
          player.srcObject = stream;
          this.isShow = true;
        })
        .catch(err => {
          alert(JSON.stringify(err));
          console.log(err);
        });
    },
    reverseCamera() {
      this.modeBack = !this.modeBack;
      this.loadCamera();
    },
    takePicture() {
      let video = document.getElementById("player" + this.index);
      let canvas = document.getElementById("canvas" + this.index);
      let context = canvas.getContext("2d");
      context.canvas.width = video.clientWidth;
      context.canvas.height = video.clientHeight;
      context.drawImage(video, 0, 0, video.clientWidth, video.clientHeight);
      this.isNotTake = false;
    },
    cancelTakePicture() {
      this.isNotTake = true;
    },
    okTakePicture() {
      let canvas = document.getElementById("canvas" + this.index);
      this.$emit("convertToBase64Canva", {
        base64: canvas.toDataURL(),
        index: this.index,
        tipo: this.tipoDocumento,
        identificador: this.identificador
      });
      this.isShow = false;
    }
  }
};
</script>