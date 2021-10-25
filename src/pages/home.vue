<template>
  <f7-page name="home" ptr @ptr:refresh="fetchData">
    <!-- Top Navbar -->
    <f7-navbar :sliding="false">
      <f7-nav-left>
        <f7-link
          icon-ios="f7:menu"
          icon-aurora="f7:menu"
          icon-md="material:menu"
          panel-open="left"
        ></f7-link>
      </f7-nav-left>
      <f7-nav-title sliding>Dashboard</f7-nav-title>
    </f7-navbar>

    <f7-swiper id="Charts" pagination>
      <f7-swiper-slide>
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
      </f7-swiper-slide>
      <f7-swiper-slide>
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
      </f7-swiper-slide>
    </f7-swiper>

    <f7-list>
      <f7-list-item title="Clients" link="/stats/clients/">
        <template #media>
          <f7-icon
            ios="f7:device_desktop"
            md="material:computer"
            aurora="material:computer"
          ></f7-icon>
        </template>
      </f7-list-item>
      <f7-list-item title="Domains" link="/stats/domains/">
        <template #media>
          <f7-icon
            ios="f7:pencil_ellipsis_rectangle"
            md="material:domain"
            aurora="material:domain"
          ></f7-icon>
        </template>
      </f7-list-item>
      <f7-list-item title="Blocked Domains" link="/stats/blocked/">
        <template #media>
          <f7-icon
            ios="f7:xmark_shield"
            md="material:gpp_bad"
            aurora="material:gpp_bad"
          ></f7-icon>
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
import api from "../js/api";
import store from "../js/store";
import { f7, f7ready, theme } from "framework7-vue";
import { reactive, ref } from "vue";

var hasLoaded = false;
export default {
  setup() {
    const queryResponseChartData = ref([]);
    const queryTypeChartData = ref([]);
    const domain = ref("");
    return {
      queryResponseChartData,
      queryTypeChartData,
      domain,
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
    fetchData: function (done) {
      api.get("getSettings").then((data) => {
        this.domain = data.dnsServerDomain;
      });

      api.get("getStats", [["type", "lastHour"]]).then((data) => {
        this.queryTypeChartData = api.buildPieChart(data.queryTypeChartData);
        this.queryResponseChartData = api.buildPieChart(
          data.queryResponseChartData
        );

        //f7.swiper.get("#Charts").update();

        if (typeof done !== "undefined") done();
      });
    },
  },
};
</script>