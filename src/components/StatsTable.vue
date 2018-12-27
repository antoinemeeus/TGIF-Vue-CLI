<template>
  <b-row>
    <b-col
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
    </b-col>
    <b-col
      v-if="!getLoading"
      id="glanceTable"
    >
      <div>
        <h3>{{title}}</h3>
      </div>
      <b-table
        show-empty
        :fields="stats_fields"
        :items="statsData"
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
      </b-table>
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: "StatsTable",
  props: ["typeData", "title", "most_Or_least", "chamber", "typeAnalisis"],

  data() {
    return {
      localLoading: true,
      statsData: [],
      stats_fields: {},
      debug_counter: 0
    };
  },
  methods: {
    setTableData() {
      this.localLoading = true;
      if (this.getMembers !== null && this.getMembers.length > 0) {
        var self = this;
        var members = this.getMembers;
        var target_index = Math.round(
          (members.length * this.$store.getters.getPctRatio) / 100
        );

        //Sorting list and reversing it if situation needed it       
        var sortedListBy = [...members].sort(function (a, b) {
          return (
            a[self.getTypeOfAnalisis.pct_vote_str] -
            b[self.getTypeOfAnalisis.pct_vote_str]
          );
        });
        if ((this.most_Or_least === "least" && this.typeAnalisis === "attendance") || (this.most_Or_least === "most" && this.typeAnalisis === "loyalty")) {
          sortedListBy.reverse();
        }
        //Recursive function to check if next candidate has same value and return list including those with same value
        function checkNext(arr, field, j) {
          if (arr[j][field] === arr[j + 1][field]) {
            return checkNext(arr, field, j + 1);
          } else return arr.slice(0, j + 1);
        }

        this.statsData = checkNext(
          sortedListBy,
          this.getTypeOfAnalisis.pct_vote_str,
          target_index - 1
        );

        //reinitialise table stats_fields;
        this.stats_fields = {};
        //populate stats_fields;
        //Adding Fields to the table field data necessary for bootstrap-vue table generator
        this.stats_fields["last_name"] = {
          label: "Full Name",
          formatter: (value, key, item) => {
            return {
              first: item.first_name,
              last: item.last_name,
              middle: item.middle_name
            };
          },
          sortable: true
        }
        var currentLabel = (this.typeAnalisis == "loyalty" ? "Party" : "Missed");

        this.stats_fields[this.getTypeOfAnalisis.vote_str] = {
          label: "Nb of " + currentLabel + " Votes",
          sortable: true,
          class: "text-center"
        };
        this.stats_fields[this.getTypeOfAnalisis.pct_vote_str] = {
          label: "% " + currentLabel + " Votes",
          formatter: value => {
            return value.toFixed(2) + "%";
          },
          sortable: true,
          class: "text-center"
        };


        this.localLoading = false;
      } else console.log("Data is empty");
    }
  },

  computed: {
    getLoading() {
      return (
        this.localLoading && this.$store.getters.getLoadingStatus(this.$route.params.chamber)
      );
    },
    getTypeOfAnalisis() {
      return this.$store.getters.getAPI_str_ByType(this.typeAnalisis);
    },
    getMembers() {
      console.log("I was Changed!");
      return this.$store.getters.getMembers[this.$route.params.chamber];
    }
  },
  watch: {
    //Create and watch the getMembers properties that is tied to the route chamber and type data.
    getMembers: {
      handler: 'setTableData',
      immediate: true
    },
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
