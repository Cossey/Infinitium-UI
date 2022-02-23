<template>
  <f7-popup>
    <f7-page>
      <f7-navbar title="DNS Results">
        <f7-nav-right>
          <f7-link popup-close>{{ $t('dialogs.close') }}</f7-link>
        </f7-nav-right>
      </f7-navbar>
      <f7-toolbar tabbar labels top>
        <f7-link
          tab-link="#dns"
          tab-link-active
          text="Answers"
          icon-ios="f7:list_bullet"
          icon-aurora="material:format_list_bulleted"
          icon-md="f7:list_bullet"
        ></f7-link>
        <f7-link
          tab-link="#raw"
          text="Raw Data"
          icon-ios="f7:bolt"
          icon-aurora="material:bolt"
          icon-md="f7:bolt"
        ></f7-link>
      </f7-toolbar>
      <f7-tabs>
        <f7-tab id="dns" tab-active>
          <f7-list media-list v-if="hasDetails">
            <f7-list-item
              class="title-wrap"
              v-for="entry in dnsDetails != null
                ? this.dnsDetails.result.Answer
                : []"
              v-bind:key="entry"
              :header="processType(entry.Type)"
              :title="processRdata(entry)"
              :footer="entry.TTL"
            >
            </f7-list-item>
            <f7-block-footer class="text-align-center"
              ><p>
                {{ this.dnsDetails.result.Metadata.RoundTripTime }}
              </p></f7-block-footer
            >
          </f7-list>
          <f7-list v-if="!hasDetails">
            <f7-list-item title="There are no items."></f7-list-item>
          </f7-list>
        </f7-tab>
        <f7-tab id="raw">
          <f7-block strong v-if="this.dnsDetailsRaw != ''">
            <p class="wrap">{{ this.dnsDetailsRaw }}</p>
          </f7-block>
          <f7-block strong v-if="this.dnsDetailsRaw == ''">
            <p class="wrap">There is no data.</p>
          </f7-block>
        </f7-tab>
      </f7-tabs>
    </f7-page>
  </f7-popup>
</template>
<style scoped>
.title-wrap :deep(.item-title),
.wrap {
  white-space: pre-wrap;
}
</style>
<script>
import { dnsRecordTypes } from "@/assets/data/dnsrecordtypes";

export default {
  props: {
    dnsDetails: Object,
    dnsDetailsRaw: String,
  },
  computed: {
    hasDetails() {
      return (
        (this.dnsDetails != null &&
        this.dnsDetails.result != null &&
        this.dnsDetails.result.Answer != null
          ? this.dnsDetails.result.Answer.length
          : 0) > 0
      );
    },
  },
  methods: {
    getType: function (type) {
      var res = dnsRecordTypes.filter((f) => f[0] == type);
      if (res.length > 0) {
        return res[0][1];
      } else {
        return "";
      }
    },
    processType: function (type) {
      var pt = type;
      var drt = this.getType(type);
      if (drt != "") {
        pt = drt;
      }
      return pt;
    },
    processRdata: function (entry) {
      switch (entry.Type) {
        case "TXT":
          return entry.RDATA.Text;
        case "NS":
          return entry.RDATA.NameServer;
        case "A":
        case "AAAA":
          return entry.RDATA.IPAddress;
        case "SOA":
        case "CAA":
        case "MX":
          var vals = "";
          for (const [key, value] of Object.entries(entry.RDATA)) {
            vals += key + ": " + value + "\n";
          }

          return vals;
        default:
          return JSON.stringify(entry.RDATA);
      }
    },
  },
};
</script>