<template>
  <div>
    <div v-if="type === 'page'" class="loader--wrapper">
      <ul>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
      <h2 class="loader-text">{{text}}</h2>
    </div>
    <div v-if="type === 'circle'" class="loader__circle">
      <div class="loader__circle--wrapper">
        <div class="loader" id="loader-1"></div>
        <h2 class="loader-text">{{text}}</h2>
      </div>
    </div>

  </div>
</template>

<script>
  export default {
    name: "Loader",
    props: {
      text: {
        type: String
      },
      type: {
        type: String,
        default: "page"
      }
    }
  }
</script>

<style scoped lang="scss">
@import '../../../assets/css/_variables.scss';

@mixin object($width, $height, $bg) {
  width: $width;
  height: $height;
  background: $bg;
}

@mixin transPos($top, $right, $bottom, $left,$transX,$transY) {
  position: absolute;
  top: $top;
  left: $left;
  right: $right;
  bottom: $bottom;
  transform:translate($transX,$transY);
}

$colors : $quali-gray-blue $quali-light-blue $quali-blue $quali-medium-blue $quali-dark-blue $quali-brand;

.loader-text {
  margin-top: 1em;

  text-align: center;
  text-transform: uppercase;
}

.loader--wrapper {
  display: table;
  margin: 0 auto;
  width: 100%;
}

ul{
  display:flex;
  position:relative;
  margin: 0 auto;
  width:90px;
  height:30px;

  list-style-type: none;

  li {
    @include object(30px,30px,null);
    border-radius:50%;
    position:absolute;
    left:0;
    transform:translatex(-50%);
    animation:load 1s cubic-bezier(.58,-0.15,.44,1.15) infinite alternate;
    @for $i from 1 through 5{
      &:nth-child(#{$i}){
        background:nth($colors,$i);
        animation-delay:0.1s * $i;
      }
    }
    @keyframes load {
      100%{
        left:100%;
      }
    }
  }
}

.loader__circle {
  $borderWidth: 5px;

  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 40;

  background-color: transparentize($quali-brand, .1);

  .loader-text {
    color: #fff;
  }

  .loader{
    width: 50px;
    height: 50px;
    border-radius: 100%;
    position: relative;
    margin: 0 auto;
  }

  #loader-1:before, #loader-1:after{
    content: "";
    position: absolute;
    top: -10px;
    left: -10px;
    width: 100%;
    height: 100%;
    border-radius: 100%;
    border: $borderWidth solid transparent;
    border-top-color: #3498db;
  }

  #loader-1:before{
    z-index: 100;
    animation: spin 1s infinite;
  }

  #loader-1:after{
    border: $borderWidth solid #ccc;
  }
}

@keyframes spin{
  0%{
    -webkit-transform: rotate(0deg);
    -ms-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
  }

  100%{
    -webkit-transform: rotate(360deg);
    -ms-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
</style>