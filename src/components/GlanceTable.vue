<template>
  <div>
    <div v-if="getLoading" id="loader" class="container h-100 align-items-stretch">
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
    </div>
    <div v-if="!getLoading" id="glanceTable">
      <div class="col">
        <b-table show-empty hover :fields="glance_fields" :items="glanceAt"></b-table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "GlanceTable",
  props: [],

  data() {
    return {
      localLoading: true,
      glanceAt: [
        {
          Party: "Democrats",
          NbOfReps: 0,
          pctOfVotes: 0
        },
        {
          Party: "Republicans",
          NbOfReps: 0,
          pctOfVotes: 0
        },
        {
          Party: "Independents",
          NbOfReps: 0,
          pctOfVotes: 0
        },
        {
          Party: "Total",
          NbOfReps: 0,
          pctOfVotes: 0
        }
      ],
      glance_fields: {
        Party: {
          label: "Party"
        },
        NbOfReps: {
          label: "Number of Reps",
          sortable: true,
          class: "text-center"
        },
        pctOfVotes: {
          label: "% Voted with Party",
          formatter: value => {
            return value.toFixed(2) + "%";
          },
          sortable: true,
          class: "text-center"
        }
      }
    };
  },
  methods: {
    getTableData() {
      if (this.getMembers != null) {
        this.localLoading = true;
        var data = this.getMembers;
        var tabelFormat_empty = [
          { Party: "Democrats", party_abrv: "D", sum: 0, NbOfReps: 0 },
          { Party: "Republicans", party_abrv: "R", sum: 0, NbOfReps: 0 },
          { Party: "Independants", party_abrv: "I", sum: 0, NbOfReps: 0 },
          { Party: "Total", party_abrv: "T", sum: 0, NbOfReps: 0 }
        ];

        var glanceStats = data.reduce((acc, obj) => {
          Object.keys(acc).map(function(key) {
            if (
              acc[key].party_abrv === obj.party ||
              acc[key].party_abrv === "T"
            ) {
              acc[key].NbOfReps += 1;
              acc[key].sum += obj.votes_with_party_pct;
            }
            acc[key].sum > 0
              ? (acc[key].pctOfVotes = acc[key].sum / acc[key].NbOfReps)
              : (acc[key].pctOfVotes = 0);
            return acc[key];
          });
          return acc;
        }, tabelFormat_empty);

        this.glanceAt = glanceStats;
        this.localLoading = false;
      } else return console.log("Data is empty");
    }
  },
  created() {
    this.getTableData();
  },
  computed: {
    getMembers() {
      return this.$store.getters.getMembers[this.$route.params.chamber];
    },
    getLoading() {
      return (
        this.localLoading ||
        this.$store.getters.getLoadingStatus(this.$route.params.chamber)
      );
    }
  },
  watch: {
    getMembers(newData, oldData) {
      console.log("GlanceVue - Computed detected a change inside store?");
      this.getTableData();
    },
    $route(to, from) {
      console.log("GlanceVue - Computed detected a change inside ROUTE?");
      this.getTableData();
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
