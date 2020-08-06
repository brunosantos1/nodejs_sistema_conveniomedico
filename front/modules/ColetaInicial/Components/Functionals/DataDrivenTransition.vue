<script>
  export default {
    functional: true,
    props: {
      isNext: {
        default: true
      }
    },
    render(createElement, context) {
      const data = {
        props: {
          appear: true,
          appearActiveClass: "rs-1 animated fadeInUp",
          enterActiveClass: context.props.isNext ? "form-in animated fadeInUp" : "form-out animated fadeInDown",
          leaveActiveClass: context.props.isNext ? "form-out animated fadeOutUp" : "animated fadeOutDown",
          name: "data-driven-transition",
          duration: 1000,
          mode: "out-in"
        }
      }
      return createElement("transition-group", data, context.children)
    }
  }
</script>