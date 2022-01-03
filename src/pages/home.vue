<template>
  <f7-page name="home" ptr @ptr:refresh="fetchData" :page-content="false">
    <f7-navbar :sliding="false" title="Dashboard">
      <template v-slot:left>
        <f7-link
          icon-ios="f7:menu"
          icon-aurora="material:menu"
          icon-md="material:menu"
          panel-open="left"
        ></f7-link>
      </template>
      <template v-slot:right>
        <f7-link
          icon-aurora="material:filter_alt"
          icon-md="material:filter_alt"
          :text="$theme.ios ? 'Filter' : ''"
          popup-open=".stats-filter"
        />
      </template>
    </f7-navbar>

    <f7-popup swipe-to-close class="stats-filter" @popup:close="fetchData()">
      <f7-view>
        <f7-page>
          <f7-navbar title="Filter">
            <f7-nav-right>
              <f7-link popup-close>Close</f7-link>
            </f7-nav-right>
          </f7-navbar>
          <f7-list>
            <f7-list-item title="Period" smart-select>
              <select name="period" v-model="period">
                <option value="lastHour" selected>Last Hour</option>
                <option value="lastDay">Last Day</option>
                <option value="lastWeek">Last Week</option>
                <option value="lastMonth">Last Month</option>
                <option value="lastYear">Last Year</option>
                <option value="custom">Custom Range</option>
              </select>
            </f7-list-item>
          </f7-list>
          <f7-block-title v-if="period === 'custom'">Period Range</f7-block-title>
          <f7-list v-if="period === 'custom'" inline-labels no-hairlines-md>
            <f7-list-input
              label="Start Date"
              type="date"
              v-model:value="start"
              placeholder="Please choose..."
            />
            <f7-list-input
              label="End Date"
              type="date"
              v-model:value="end"
              placeholder="Please choose..."
            />
          </f7-list>
        </f7-page>
      </f7-view>
    </f7-popup>

    <f7-toolbar tabbar labels bottom>
      <f7-link
        tab-link="#requests"
        text="Requests"
        icon-ios="f7:cloud"
        icon-aurora="material:dns"
        icon-md="material:dns"
      ></f7-link>
      <f7-link
        tab-link="#client"
        text="Clients"
        icon-ios="f7:device_desktop"
        icon-aurora="material:computer"
        icon-md="material:computer"
      ></f7-link>
      <f7-link
        tab-link="#domains"
        text="Domains"
        icon-ios="f7:pencil_ellipsis_rectangle"
        icon-aurora="material:domain"
        icon-md="material:domain"
      ></f7-link>
      <f7-link
        tab-link="#blocked"
        text="Blocked"
        icon-ios="f7:xmark_shield"
        icon-aurora="material:gpp_bad"
        icon-md="material:gpp_bad"
      ></f7-link>
    </f7-toolbar>
    <f7-tabs>
      <f7-tab id="requests" class="page-content" tab-active>
        <f7-block-title>Query Type</f7-block-title>
        <f7-block>
          <f7-pie-chart
            v-if="queryTypeChartData.length > 0"
            tooltip
            :datasets="queryTypeChartData"
          />
          <f7-row v-if="queryTypeChartData.length == 0">
            <f7-col>
              <p>No Data.</p>
            </f7-col>
          </f7-row>
        </f7-block>
        <f7-block-title>Query Response</f7-block-title>
        <f7-block>
          <f7-pie-chart
            v-if="queryResponseChartData.length > 0"
            tooltip
            :datasets="queryResponseChartData"
          />
          <f7-row v-if="queryResponseChartData.length == 0">
            <f7-col>
              <p>No Data.</p>
            </f7-col>
          </f7-row>
        </f7-block>
      </f7-tab>
      <f7-tab id="client" class="page-content">
        <f7-list>
          <f7-list-item title="More" link="#" @click="moreStats('clients')" />
        </f7-list>

        <div class="data-table">
          <table>
            <thead>
              <tr>
                <th class="label-cell">Client</th>
                <th class="numeric-cell">Queries</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="client in top.clients" :key="client.name">
                <td class="label-cell">{{ client.name }}</td>
                <td class="numeric-cell">{{ client.hits }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </f7-tab>

      <f7-tab id="domains" class="page-content">
        <f7-list>
          <f7-list-item title="More" link="#" @click="moreStats('domains')" />
        </f7-list>

        <div class="data-table">
          <table>
            <thead>
              <tr>
                <th class="label-cell">Domain</th>
                <th class="numeric-cell">Hits</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="domain in top.domains" :key="domain.name">
                <td class="label-cell">{{ domain.name }}</td>
                <td class="numeric-cell">{{ domain.hits }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </f7-tab>
      <f7-tab id="blocked" class="page-content">
        <f7-list>
          <f7-list-item title="More" link="#" @click="moreStats('blocked')" />
        </f7-list>

        <div class="data-table">
          <table>
            <thead>
              <tr>
                <th class="label-cell">Domain</th>
                <th class="numeric-cell">Hits</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="block in top.blocked" :key="block.name">
                <td class="label-cell">{{ block.name }}</td>
                <td class="numeric-cell">{{ block.hits }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </f7-tab>
    </f7-tabs>

    <f7-list>
      <f7-list-item title="Clients" link="/stats/clients/">
        <template #media>
          <f7-icon ios="f7:device_desktop" md="material:computer" aurora="material:computer"></f7-icon>
        </template>
      </f7-list-item>
      <f7-list-item title="Domains" link="/stats/domains/">
        <template #media>
          <f7-icon ios="f7:pencil_ellipsis_rectangle" md="material:domain" aurora="material:domain"></f7-icon>
        </template>
      </f7-list-item>
      <f7-list-item title="Blocked Domains" link="/stats/blocked/">
        <template #media>
          <f7-icon ios="f7:xmark_shield" md="material:gpp_bad" aurora="material:gpp_bad"></f7-icon>
        </template>
      </f7-list-item>
    </f7-list>
  </f7-page>
</template>
<style scoped>
.pie-chart:deep() svg {
  max-width: 320px;
}
</style>
<script>
import { f7ready } from "framework7-vue";

var hasLoaded = false;
export default {
  props: {
    f7router: Object
  },
  data() {
    return {
      queryResponseChartData: [],
      queryTypeChartData: [],
      domain: "",
      top: [],
      period: 'lastHour',
      start: '',
      end: '',
    };
  },
  mounted() {
    f7ready((f7) => {
      if (!hasLoaded) {
        this.fetchData();
        hasLoaded = true;
      }
    });
  },
  methods: {
    moreStats: function (statsType) {
      this.f7router.navigate(
        `/stats/${statsType}/`,
        {
          props: {
            type: this.period,
            start: this.start,
            end: this.end,
          }
        });
    },
    fetchData: function (done) {
      var params = [["type", this.period]];
      if (this.period == "custom") {
        params.push(["start", this.start]);
        params.push(["end", this.end]);
      }
      this.$api.get("getStats", params).then((data) => {
        this.queryTypeChartData = this.$api.buildPieChart(data.queryTypeChartData);
        this.queryResponseChartData = this.$api.buildPieChart(
          data.queryResponseChartData
        );
        this.top = {
          clients: data.topClients,
          domains: data.topDomains,
          blocked: data.topBlockedDomains,
        };

        if (typeof done !== "undefined") done();
      });
    },
  },
};
</script>