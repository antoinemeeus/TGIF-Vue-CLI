<template>
  <b-row>
    <b-col v-if="getLoading" id="loader" class="container h-100 align-items-stretch">
      <div
        class="h-100 py-2 d-flex align-self-stretch align-items-sm-center loader-bg-color justify-content-center"
      >
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
    <b-col v-if="!getLoading" id="glanceTable">
      <div>
        <h3>{{title}}</h3>
      </div>
      <b-table show-empty :fields="stats_fields" :items="statsData">
        <template slot="last_name" slot-scope="data">
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
  props: ["title", "most_Or_least", "chamber", "typeAnalisis"],

  data() {
    return {
      localLoading: true,
      statsData: [],
      stats_fields: {
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
        }
      },
      debug_counter: 0,
      display_successfull: false
    };
  },
  methods: {
    getTableData() {
      this.display_successfull = false;
      if (this.getMembers !== null && this.getMembers.length > 0) {
        this.localLoading = true;
        var self = this;
        var members = this.getMembers;
        var tempList = [];
        //reinitialize the table:
        var length_list = members.length;
        var target_index = Math.round(
          (length_list * this.$store.getters.getPctRatio) / 100
        );
        //Helpers recursive to pct Ratio
        function compareNext(arr, field, j) {
          if (arr[j][field] === arr[j + 1][field]) {
            return compareNext(arr, field, j + 1);
          } else return arr.slice(0, j + 1);
        }

        function comparePrev(arr, field, j) {
          if (arr[j][field] === arr[j - 1][field]) {
            return comparePrev(arr, field, j - 1);
          } else return arr.slice(j).reverse();
        }

        var sortedListBy = [...members].sort(function(a, b) {
          return (
            a[self.getTypeOfAnalisis.pct_vote_str] -
            b[self.getTypeOfAnalisis.pct_vote_str]
          );
        });

        if (this.most_Or_least === "most") {
          if (self.typeAnalisis === "attendance")
            tempList = compareNext(
              sortedListBy,
              self.getTypeOfAnalisis.pct_vote_str,
              target_index - 1
            );
          if (self.typeAnalisis === "loyalty")
            tempList = comparePrev(
              sortedListBy,
              self.getTypeOfAnalisis.pct_vote_str,
              sortedListBy.length - target_index
            );
        }
        if (this.most_Or_least === "least") {
          if (self.typeAnalisis === "attendance")
            tempList = comparePrev(
              sortedListBy,
              self.getTypeOfAnalisis.pct_vote_str,
              sortedListBy.length - target_index
            );
          if (self.typeAnalisis === "loyalty")
            tempList = compareNext(
              sortedListBy,
              self.getTypeOfAnalisis.pct_vote_str,
              target_index - 1
            );
        } else this.statsData = [];

        this.statsData = tempList;
        //Adding Fields to the table field data
        this.stats_fields[this.getTypeOfAnalisis.vote_str] = {
          label: "Nb of Votes",
          sortable: true,
          class: "text-center"
        };
        this.stats_fields[this.getTypeOfAnalisis.pct_vote_str] = {
          label: "% Party Votes",
          formatter: value => {
            return value.toFixed(2) + "%";
          },
          sortable: true,
          class: "text-center"
        };

        this.display_successfull = true;
        this.localLoading = false;
      } else console.log("Data is empty");
    }
  },
  created() {
    this.getTableData();
  },
  computed: {
    getLoading() {
      return (
        this.localLoading && this.$store.getters.getLoadingStatus(this.chamber)
      );
    },
    getTypeOfAnalisis() {
      return this.$store.getters.getAPI_str_ByType(this.typeAnalisis);
    },
    getMembers() {
      return this.$store.getters.getMembers[this.chamber];
    }
  },
  watch: {
    getMembers() {
      this.getTableData();
    },
    $route() {
      //console.log("StatsVue - Watch detected a change inside store for ROUTE?");
      this.display_successfull ? null : this.getTableData();
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
