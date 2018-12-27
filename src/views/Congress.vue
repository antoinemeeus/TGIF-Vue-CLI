<template>
  <div class="congress">
    <main>
      <section>
        <div class="row d-flex justify-content-between">
          <div class="col pt-5 col-lg-7 col-sm-10">
            <div v-html="$store.state[chamber].htmlContent"></div>
          </div>
          <div class="pt-5 col-auto col-lg-5 col-sm-2">
            <div
              v-if="getLoading"
              id="loader"
              class="container h-100 align-items-stretch"
            >
              <div class="h-100 py-2 d-flex align-self-stretch align-items-sm-center loader-bg-color justify-content-center">
                <div class="loader">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <b-container class="bg-white py-2 sticky-top-form">
        <b-row class="d-flex justify-content-between my-sm-2">
          <b-form inline>
            <label
              class="mr-sm-2"
              for="inlineCheckBox"
            >Filter by Party:</label>
            <b-form-checkbox-group
              id="inlineCheckBox"
              v-model="selected"
              name="partyFilter"
              :options="options"
            ></b-form-checkbox-group>
          </b-form>
          <b-form inline>
            <label
              class="mr-sm-2"
              for="inlineSelect"
            >Filter by State:</label>
            <b-form-select
              class="mb-2 mr-sm-2 mb-sm-0"
              :value="null"
              v-model="state_filter"
              :options="sortedStates"
              id="inlineSelect"
            >
              <option
                slot="first"
                value="All"
              >Select All...</option>
            </b-form-select>
          </b-form>
        </b-row>

        <b-row class="d-flex justify-content-between my-sm-2">
          <b-form inline>
            <span mr-2>
              Sorting By:
              <b>{{ fields[sortBy].label }}</b>
              ,
              Sort direction:
              <b>{{ sortDesc ? 'Ascending': 'Descending' }}</b>
            </span>
          </b-form>
          <b-form inline>
            <b-form-group
              horizontal
              label="Search"
              class="mb-0"
            >
              <b-input-group>
                <b-form-input
                  v-model="search"
                  placeholder="Type to Search"
                />
                <b-input-group-append>
                  <b-btn
                    :disabled="!search"
                    @click="search = ''"
                  >Clear</b-btn>
                </b-input-group-append>
              </b-input-group>
            </b-form-group>
          </b-form>
        </b-row>
      </b-container>
      <b-row>
        <div class="col">
          <b-table
            thead-class="nav-sticky"
            show-empty
            hover
            :sort-by.sync="sortBy"
            :sort-desc.sync="sortDesc"
            :fields="fields"
            :items="upToDateTable"
            :filter="search"
            @filtered="onFiltered"
          >
            <template
              slot="last_name"
              slot-scope="data"
            >
              <a
                :href="`${data.item.url}`"
                target="_blank"
              >{{data.value.last}} {{data.value.middle}} {{data.value.first}}</a>
            </template>
            <template slot="table-caption">Showing {{totalRows}} of {{getMembers.length}} entries</template>
          </b-table>
        </div>
      </b-row>
    </main>
  </div>
</template>


<script>
export default {
  props: ["chamber"],
  name: "congress",
  data() {
    return {
      //CheckBoxes Options
      options: [
        { text: "Republican", value: "R" },
        { text: "Democrats", value: "D" },
        { text: "Independents", value: "I" }
      ],
      //Table Data
      fields: {
        // A column that needs custom formatting
        last_name: {
          label: "Full Name",
          formatter: (value, key, item) => {
            return {
              first: item.first_name,
              last: item.last_name,
              middle: item.middle_name
            };
          },
          sortable: true
        },
        party: { label: "Party", sortable: true },
        state: { label: "State", sortable: true },
        seniority: { label: "Years in Office", sortable: true },
        votes_with_party_pct: { label: "% Vote w/ Party", sortable: true }
      },
      sortBy: "last_name",
      sortDesc: false,
      state_filter: "All",
      search: "",
      totalRows: 0,
      selected: ["R", "D", "I"],
      members: []
    };
  },

  methods: {
    getStateFullName: function (stateAbbr) {
      if (typeof this.$store.state.FullNameStatesD !== "undefined") {
        return this.$store.state.FullNameStatesD[stateAbbr];
      }
      return stateAbbr;
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      //this.currentPage = 1;
    }
  },
  computed: {
    fullNameState() {
      return this.$store.getters.getFullStatesName;
    },
    getLoading() {
      return this.$store.getters.getLoadingStatus(this.chamber);
    },
    getMembers() {
      return this.$store.getters.getMembers[this.chamber];
    },
    sortedStates: function () {
      var uniqueStates = Array.from(
        new Set(this.getMembers.map(member => member.state).sort())
      );
      var options = uniqueStates.map(el => {
        return { value: el, text: this.fullNameState[el] };
      });
      return options;
    },

    upToDateTable: function () {
      var self = this;
      var listFiltered = [];
      //Filtering with the filter
      listFiltered = this.getMembers.filter(member => {
        return (
          self.selected.includes(member.party) &&
          (self.state_filter === "All" || self.state_filter === member.state)
        );
      });
      return listFiltered;
    }
  },
};
</script>

<style scoped>
.sticky-top-form {
  position: sticky !important;
  top: 3.4375rem;
  background: #c5e0fc;
  z-index: 1019;
}
</style>