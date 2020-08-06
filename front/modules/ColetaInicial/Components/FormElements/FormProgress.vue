<template>
  <div class="row progress-bar align-items-center">
    <div class="col-10">
      <div class="progress-bar__outer">
        <div class="progress-bar__inner"></div>
      </div>
    </div>
    <div class="col-2">
      <div class="progress-bar__number"><b>{{step}}</b>/{{completed}}</div>
    </div>
  </div>
</template>
<style scoped lang="scss">
  @import "@/assets/css/_variables.scss";

  $radius: 7px;

  .progress-bar {
    padding-top: 30px;
    padding-bottom: 30px;

    background-color: #fff;
    /* Permalink - use to edit and share this gradient: https://colorzilla.com/gradient-editor/#ffffff+71,ffffff+100&1+71,0+100 */
    background: -moz-linear-gradient(top,  rgba(255,255,255,1) 71%, rgba(255,255,255,0) 100%); /* FF3.6-15 */
    background: -webkit-linear-gradient(top,  rgba(255,255,255,1) 71%,rgba(255,255,255,0) 100%); /* Chrome10-25,Safari5.1-6 */
    background: linear-gradient(to bottom,  rgba(255,255,255,1) 71%,rgba(255,255,255,0) 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#ffffff', endColorstr='#00ffffff',GradientType=0 ); /* IE6-9 */



  }

  .progress-bar__outer {
    height: 14px;

    border-radius: $radius;
    background-color: var(--quali-light-x-gray);
  }

  .progress-bar__number {
    color: var(--quali-brand);
    font-size: 14px;
    letter-spacing: .2em;

    b {
      font-size: 18px;
    }
  }

  .progress-bar__inner {
    height: 100%;
    width: 0px;

    background-color: var(--quali-brand);
    border-top-left-radius: $radius;
    border-bottom-left-radius: $radius;
    border-top-right-radius: $radius;
    border-bottom-right-radius: $radius;
    bottom: 66px;
  }
</style>
<script>
import { TimelineLite } from "gsap"
export default {
  name: "form-progress",
  inject: ["formState"],
  computed: {
    percent() {
      return (this.formState.activeField / this.formState.formLength) * 100
    },
    step(){
      return this.formState.activeField + 1;
    },
    completed(){
      return this.formState.formLength + 1
    }
  },
  watch: {
    percent(newVal) {
      let el = document.getElementsByClassName("progress-bar__inner")
      let tl = new TimelineLite()
      tl.to(el, 1, {
        width: newVal + "%"
      })
    }
  }
}
</script>
