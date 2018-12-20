<template>
  <div class="analisis">
    <main>
      <b-container fluid>
        <b-row inline class="my-3 justify-content-between">
          <b-col cols="6">
            <div v-html="$store.state[gethtmlContent].htmlContent"></div>
          </b-col>
          <b-col align-self="end" cols="6">
            <GlanceTable></GlanceTable>
          </b-col>
        </b-row>
        <b-row inline class="justify-content-between">
          <b-col>
            <StatsTable
              title="Least Engaged (Bottom 10% Attendance)"
              most_Or_least="least"
              :chamber="chamber"
              :typeAnalisis="typeData"
            ></StatsTable>
          </b-col>
          <b-col>
            <StatsTable
              title="Most Engaged (Top 10% Attendance)"
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
  methods: {},
  computed: {
    getMembers() {
      return this.$store.getters.getMembers[this.chamber];
    },
    gethtmlContent() {
      return this.typeData + "Post";
    }
  },
  watch: {
    $route(to, from) {}
  }
};
</script>