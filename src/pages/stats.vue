<template>
  <f7-page :page-content="false">
    <f7-navbar back-link="Dashboard" :title="displayStatsType + ' Stats'">
      <f7-subnavbar>
        <f7-searchbar
          search-container=".search-list"
          search-item="tr"
          search-in=".label-cell"
          :placeholder="$t('misc.search')"
          :disable-button="!$theme.aurora"
        ></f7-searchbar>
      </f7-subnavbar>
    </f7-navbar>
    <f7-page-content ptr @ptr:refresh="fetchData">
      <div class="data-table">
        <table>
          <thead>
            <tr v-if="displayStatsType == 'Client'">
              <th class="label-cell">Client</th>
              <th class="numeric-cell">Queries</th>
            </tr>
            <tr v-else>
              <th class="label-cell">Domain</th>
              <th class="numeric-cell">Hits</th>
            </tr>
          </thead>
          <tbody class="search-list searchbar-found">
            <tr class v-for="stat in stats" :key="stat.name">
              <td class="label-cell">{{ stat.name }}</td>
              <td class="numeric-cell">{{ stat.hits }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr class="searchbar-not-found" v-if="stats.length > 0">
              <td colspan="2">No search results found.</td>
            </tr>
            <tr v-else>
              <td colspan="2">No results.</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </f7-page-content>
  </f7-page>
</template>
<script>
import { f7ready } from "framework7-vue";

export default {
  data() {
    return {
      stats: [],
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
    start: String,
    end: String,
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
    fetchData(done) {
      var params = [["statsType", this.statsType]];
      if (this.type) params.push(["type", this.type]);
      if (this.limit) params.push(["limit", this.limit]);

      if (this.type === "custom") {
        params.push(["start", this.start]);
        params.push(["end", this.end]);
      }
      this.$api
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