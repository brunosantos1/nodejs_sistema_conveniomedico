<template>
  <div class="box-select">
    <v-select
      ref="autoComponent"
      :placeholder="loading ? 'Carregando...' : placeholder"
      :options="results"
      :item-text="searchKey"
      :id="'autocomplete'"
      :name="'autocomplete'"
      class="form-control"
      :value="selected"
      :clearable="false"
      @input="setResultSelect($event)"
    >
      <div slot="no-options">Nenhum resultado encontrado</div>
    </v-select>
    <!-- <input
        ref='autoComponent'
        :placeholder="placeholder"
        type="text"
        v-model="search"
        @input="filterItems"
        @focus="filterItems"
        :disabled="loading"
      />
      <ul v-show="isOpen" class="autocomplete-answers">
        <li v-for="item in results">
          <a @click="setResult(item[searchKey])">{{item[searchKey]}}</a>
        </li>
    </ul>-->
  </div>
</template>

<style scoped lang="scss">
.autocomplete-answers {
  max-height: 30vh;
  margin: 0;
  padding: 0;
  overflow: scroll;

  box-shadow: 2px 2px 12px rgba(216, 216, 216, 0.504152);
  list-style-type: none;

  li {
    padding-bottom: 0.5em;
    padding-top: 0.5em;
    padding-left: 0.2em;

    font-size: 0.8em;

    &:nth-child(even) {
      background-color: var(--quali-light-x-gray);
    }
  }
}

.box-select {
  border: none;
  border-bottom: 2px solid var(--quali-brand);
  .form-control {
    border: none;
    padding-left: 0;
  }
}
</style>

<script>
// Services
import profissaoService from "@/services/api-profissao";
import entidadeService from "@/services/api-entidade";
import { mapMutations, mapGetters, mapActions } from "vuex";
import Loader from "@/modules/Global/Components/Loader.vue";

export default {
  name: "Autocomplete",
  components: {
    Loader
  },
  props: {
    datasource: {
      type: Object,
      required: true,
      default: () => []
    },
    value: {
      type: String
    },
    placeholder: {
      type: String
    }
  },
  data() {
    return {
      search: "",
      selected: "",
      isOpen: false,
      results: [],
      listing: {},
      searchKey: "",
      loading: false
    };
  },
  mounted() {},
  created() {
    this.checkEndpoint();
    this.selected = this.value;
  },
  methods: {
    ...mapMutations({
      updateField: "ColetaDados/updateField"
    }),
    notice() {
      console.log("NOTICE OK");
      this.checkEndpoint();
    },
    filterItems(value) {
      this.isOpen = true;
      if (this.listing.length > 0) {
        this.results = this.listing.filter(item => {
          const regex = new RegExp(this.search, "gi");
          return item[this.searchKey].match(regex);
        });
      }
    },
    formatResult() {
      if (this.listing.length > 0) {
        this.results = this.listing.map(item => {
          return {
            label: item[this.searchKey],
            code: item[this.searchKey]
          };
        });
      }
    },
    setResult(result) {
      this.isOpen = false;
      this.search = result.replace("\n", " ");
      this.value = this.search;
      this.$emit("input", result);
    },
    setResultSelect(result) {
      if (!result.code) return;
      this.$emit("input", result.code);
      this.search = result.code;
      this.selected = result.code;
    },
    async checkEndpoint() {
      this.loading = true;
      if (this.datasource.endpoint === "profissao") {
        const data = this.$store.state["ColetaDados"].formData;
        if (!this.searchKey) {
          this.searchKey = "profissao";

          await this.listarProfissoes(data.estado, data.cidade);
        }

        if (this.search.length > 0) {
          await this.listarEntidades(this.search, data.estado, data.cidade);
        }
      }

      if (this.datasource.endpoint === "entidade") {
        const entidades = this.$store.state.ColetaDados.formData.listaEntidades;

        if (entidades && entidades.length > 0) {
          this.loading = false;
          this.searchKey = "NomeFantasia";
          if (entidades.length === 1) {
            this.$emit("jumpQuestion");
            this.setResult(entidades[0].NomeFantasia);
          }
          this.listing = entidades;
        } else {
          this.loading = true;
          this.listing = [];
        }
        setTimeout(() => {
          this.focusField();
        }, 800);
      }
      this.formatResult();
    },
    async listarProfissoes(uf, cidade) {
      try {
        var profissoes = await profissaoService.listarPorEstado(uf, cidade);
        this.listing = profissoes.data;
        this.focusField();
      } catch (error) {
        this.focusField();
      }
    },
    async listarEntidades(profissao, uf, cidade) {
      var entidades = await entidadeService.listarPorEstado(
        profissao,
        uf,
        cidade
      );
      this.updateField({ key: "listaEntidades", value: entidades.data });
    },
    focusField() {
      setTimeout(() => {
        this.loading = false;
        // if (!this.$refs.autoComponent || !this.$refs.autoComponent.$el) return;
        // const input = this.$refs.autoComponent.$el.querySelector("input");
        // if (input && !this.selected) input.focus();
      }, 800);
    }
  }
};
</script>