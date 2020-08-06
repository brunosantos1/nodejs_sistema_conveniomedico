/*
* Joao, 10/2019
* proposito: ...
*/

export default {
  methods: {
    trackerRoute(routerBack) {
      if (!routerBack || !routerBack.hasOwnProperty("where") || !routerBack.hasOwnProperty("then")) {
        throw "não foi possível encontrar as propriedades 'where' e/ou 'then' no objeto passado como parametro";
      }
      return Tracker.add(new Track(routerBack.where, routerBack.then, routerBack.params));
    },
    track(to, from) {
      let [trackingNow] = Tracker.listar();

      if (!!trackingNow) {
        let regWhereRoutes = new RegExp(trackingNow.where, "gi");
        let lastRoute = this.lastRoute();
        let result = to;

        if (regWhereRoutes.test(from.name) && lastRoute.name != to.name) {
          Tracker.remover(trackingNow);
          result = { name: trackingNow.then, params : trackingNow.params };
        }

        return result;
      } else {
        return to;
      }
    },
    clearAll() {
      return Tracker.limpar();
    },
    lastRoute(route = null) {
      if ("sessionStorage" in window) {
        if (route != null) {
          let { name, params } = route;
          let routerToSave = {
            name,
            params
          };

          window.sessionStorage.setItem(Tracker.HIST_NAME, JSON.stringify(routerToSave));
        } else {
          let histJson = window.sessionStorage.getItem(Tracker.HIST_NAME) || "{}";
          return JSON.parse(histJson);
        }
      }
    }
  }
}

let Tracker = {
  STORE_NAME: "tracker",
  HIST_NAME: "tracker_hist",
  add(track) {
    if ("sessionStorage" in window) {
      let listTracker = "[]";

      listTracker = window.sessionStorage.getItem(this.STORE_NAME) || "[]";
      listTracker = JSON.parse(listTracker);
      listTracker.push(track);

      window.sessionStorage.setItem(this.STORE_NAME, JSON.stringify(listTracker));

      setTimeout(() => {
        if ("sessionStorage" in window) {
          window.sessionStorage.setItem(this.STORE_NAME, "[]");
        }
      }, (1000 * 60 * 60));

    }
  },
  remover(track) {
    if ("sessionStorage" in window) {
      let listTracker = "[]";

      listTracker = window.sessionStorage.getItem(this.STORE_NAME) || "[]";
      listTracker = JSON.parse(listTracker);

      listTracker = listTracker.filter((t) => {
        return t.id != track.id;
      });
      
      window.sessionStorage.setItem(this.STORE_NAME, JSON.stringify(listTracker));
    }
  },
  listar() {
    if ("sessionStorage" in window) {
      let listTracker = "[]";
      listTracker = window.sessionStorage.getItem(this.STORE_NAME) || "[]";
      return JSON.parse(listTracker);
    }
  },
  limpar() {
    if ("sessionStorage" in window) {
      window.sessionStorage.setItem(this.STORE_NAME, JSON.stringify([]));
      return true;
    } else {
      return false;
    }
  }
}

class Track {
  constructor(where, then, params) {
    this.id = (function guid() {
      return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
      );
    })();
    this.params = params;
    this.where = where;
    this.then = then;
  }
}

Object.freeze(Tracker);