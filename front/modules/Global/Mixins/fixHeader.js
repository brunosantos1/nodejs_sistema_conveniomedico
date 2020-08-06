function attachEvent(el, params, index = 0, headerHeight) {
  window.addEventListener("scroll", () => {
    if (el) {
      if (window.scrollY > params.top) {
        if (!el.classList.contains("fixHeader")) {
          if (el.id == "btnDesktop") {
            document.querySelector(".page-wrapper").classList.add('headerFixed');
          }
          el.classList.add('fixHeader', `fixHeader-${index}`);
        }
      } else {
        el.classList.remove("fixHeader");
        document.querySelector(".page-wrapper").classList.remove('headerFixed');
      }
    }
  });
}

export default {
  mounted(){
    this.fixHeader();
  },
  methods: {
    fixHeader(element = []){
      // Adiciona o Header como default no array de binding
      const Header = document.querySelector(".site--header");
      element.push(Header);
      let headerHeight = Header.getBoundingClientRect();
      // Loop dos elementos inputados antes
      element.forEach((item) => {
        if (item) {
          if (Array.isArray(item)) {
            item.map( (itemTop, index) => {
              console.log(itemTop.getBoundingClientRect());
              attachEvent(itemTop, itemTop.getBoundingClientRect(), index, headerHeight);
            }); 
          } else {
            attachEvent(item, item.getBoundingClientRect(), 0, headerHeight);
          }
        }
      })
    }
  }
}