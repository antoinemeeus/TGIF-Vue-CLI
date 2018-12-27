<template>
  <div class="analisis">
    <main>
      <b-container fluid>
        <b-row
          inline
          class="my-3 justify-content-between"
        >
          <b-col sm="6">
            <div v-html="$store.state[gethtmlContent].htmlContent"></div>
          </b-col>
          <b-col
            align-self="end"
            sm="6"
          >
            <GlanceTable></GlanceTable>
          </b-col>
        </b-row>
        <b-row
          inline
          class="justify-content-between"
        >
          <b-col>
            <StatsTable
              :title="titleGenerator('Least')"
              most_Or_least="least"
              :chamber="chamber"
              :typeAnalisis="typeData"
            ></StatsTable>
          </b-col>
          <b-col>
            <StatsTable
              :title="titleGenerator('Most')"
              most_Or_least="most"
              :chamber="chamber"
              :typeAnalisis="typeData"
            ></StatsTable>
          </b-col>
        </b-row>
      </b-container>
    </main>
  </div>
</template>



<script>
import StatsTable from "@/components/StatsTable.vue";
import GlanceTable from "@/components/GlanceTable.vue";
export default {
  props: ["chamber", "typeData"],
  name: "analisis",
  data() {
    return {};
  },
  components: {
    StatsTable,
    GlanceTable
  },
  methods: {
    titleGenerator(str) {
      return (
        str +
        " " +
        (this.typeData == "loyalty" ? "Loyal" : "Engaged") +
        " (Bottom " +
        this.$store.state.PCT_RATIO +
        "% of " +
        (this.typeData == "loyalty" ? "Party" : "Attendance") +
        ")"
      );
    }
  },
  computed: {
    gethtmlContent() {
      return this.typeData + "Post";
    }
  },
};
</script>