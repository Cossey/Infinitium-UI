<template>
  <f7-page ptr @ptr:refresh="fetchData">
    <f7-navbar back-link="Dashboard">
      <f7-nav-title>{{ displayStatsType }} Stats</f7-nav-title>
    </f7-navbar>
    <f7-block-title>Filter</f7-block-title>
    <f7-list>
      <f7-list-item title="Period" smart-select>
        <select name="period" v-model="period">
          <option value="lastHour" selected>Last Hour</option>
          <option value="lastDay">Last Day</option>
          <option value="lastWeek">Last Week</option>
          <option value="lastMonth">Last Month</option>
          <option value="lastYear">Last Year</option>
        </select>
      </f7-list-item>
      <f7-list-button
        v-if="this.period !== this.lastPeriod"
        title="Refresh"
        @click="fetchData()"
      >
      </f7-list-button>
      <f7-block-footer v-if="this.period !== this.lastPeriod">
        <p>
          You have changed the Period. Refresh the page to see the new stats.
        </p>
      </f7-block-footer>
    </f7-list>
    <f7-block-title>Results</f7-block-title>
    <f7-list>
      <f7-list-item
        v-for="stat in stats"
        :key="stat.name"
        :title="stat.name"
        :subtitle="stat.domain"
        :after="stat.hits"
      ></f7-list-item>
      <f7-list-item
        v-if="stats.length === 0"
        title="There is no stats."
      ></f7-list-item>
    </f7-list>
    <f7-block-footer class="text-align-center">
      <p>{{ this.count }} items</p></f7-block-footer
    >
  </f7-page>
</template>
<script>
import api from "@/js/api";
import { f7, f7ready, theme } from "framework7-vue";

export default {
  data() {
    return {
      stats: [],
      period: this.type || "lastHour",
      lastPeriod: this.type || "lastHour",
    };
  },
  mounted() {
    f7ready((f7) => {
      this.fetchData();
    });
  },
  props: {
    statsType: String,
    type: String,
    limit: Number,
  },
  computed: {
    count() {
      return this.stats.length;
    },
    displayStatsType() {
      switch (this.statsType.toLowerCase()) {
        case "topclients":
          return "Client";
        case "topdomains":
          return "Domain";
        case "topblockeddomains":
          return "Blocked Domain";
      }
    },
    statsTypeProperty() {
      switch (this.statsType.toLowerCase()) {
        case "topclients":
          return "topClients";
        case "topdomains":
          return "topDomains";
        case "topblockeddomains":
          return "topBlockedDomains";
      }
    },
  },
  methods: {
    periodChange(e) {
      if (this.period !== this.lastPeriod) {
      }
    },
    fetchData(done) {
      var params = [["statsType", this.statsType]];
      if (this.period) params.push(["type", this.period]);
      if (this.limit) params.push(["limit", this.limit]);

      api
        .get("getTopStats", params)
        .then((res) => {
          console.log("stats" + this.statsTypeProperty);
          this.stats = res[this.statsTypeProperty];
          this.lastPeriod = this.period;
        })
        .finally(() => {
          if (typeof done !== "undefined") done();
        });
    },
  },
};
</script>