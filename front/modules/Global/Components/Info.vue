<template>
  <span>
    <span class="badge badge-info" v-bind:id="this.hash"><b>i</b></span>
    <b-tooltip v-bind:target="this.hash">{{ this.value }}</b-tooltip>
  </span>
</template>

<style lang="scss">

  @import "../../../assets/css/responsive.scss";

  .badge-info {
		vertical-align: middle !important;
		background-color: var( --quali-dark-blue ) !important;
		font-size: .7rem !important;
	}

</style>

<script>

  export default {
    name: "info",
		props: ["value"],
		data: function () {
			return {
        hash : ""
			}
    },
    methods : {
      guid: function() {
        return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
          (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
      }
    },
    created(){
      this.hash = this.guid();
      this.value = this.value || "";
    }
  }

</script>