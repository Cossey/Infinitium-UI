<template>
  <f7-page name="dnsclient" :page-content="false">
    <f7-navbar title="DNS Client" back-link="Back"> </f7-navbar>

    <f7-toolbar tabbar labels bottom>
      <f7-link
        tab-link="#lookup"
        tab-link-active
        text="Lookup"
        icon-ios="f7:search"
        icon-aurora="material:search"
        icon-md="f7:search"
      ></f7-link>
      <f7-link
        tab-link="#dns"
        text="Results"
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
      <f7-tab id="lookup" class="page-content" tab-active>
        <f7-list inline-labels no-hairlines-md ref="clientInputs">
          <f7-list-input
            label="Server"
            type="text"
            validate
            required
            error-message="A DNS Server is required."
            @change="serverChange"
            v-model:value="server"
          ></f7-list-input>
          <f7-list-button
            popup-open=".dnsservers-selector"
            title="Select DNS Server"
          ></f7-list-button>
          <f7-list-input
            label="Domain"
            type="text"
            validate
            required
            :pattern="regexDomain()"
            error-message="Enter a valid domain name."
            v-model:value="domain"
            placeholder="example.com"
          >
          </f7-list-input>
          <f7-list-item title="Type" smart-select ref="typeSS">
            <select id="dnsType" v-model="type">
              <option value="ANY">ANY</option>
              <option selected value="A">A [{{ getType("A") }}]</option>
              <option value="NS">NS [{{ getType("NS") }}]</option>
              <option value="CNAME">CNAME [{{ getType("CNAME") }}]</option>
              <option value="SOA">SOA [{{ getType("SOA") }}]</option>
              <option value="PTR">PTR [{{ getType("PTR") }}]</option>
              <option value="MX">MX [{{ getType("MX") }}]</option>
              <option value="TXT">TXT [{{ getType("TXT") }}]</option>
              <option value="AAAA">AAAA [{{ getType("AAAA") }}]</option>
              <option value="SRV">SRV [{{ getType("SRV") }}]</option>
              <option value="CAA">CAA [{{ getType("CAA") }}]</option>
              <option value="AXFR">AXFR [{{ getType("AXFR") }}]</option>
              <option value="ANAME">ANAME</option>
              <option value="FWD">FWD</option>
            </select>
          </f7-list-item>
          <f7-list-item
            title="Protocol"
            :disabled="availableProtocols.length == 1"
            ref="protocolSS"
            smart-select
          >
            <select v-model="protocol">
              <option
                value="udp"
                :disabled="availableProtocols.indexOf('udp') === -1"
              >
                DNS-over-UDP
              </option>
              <option
                value="tcp"
                :disabled="availableProtocols.indexOf('tcp') === -1"
              >
                DNS-over-TCP
              </option>
              <option
                value="tls"
                :disabled="availableProtocols.indexOf('tls') === -1"
              >
                DNS-over-TLS
              </option>
              <option
                value="https"
                :disabled="availableProtocols.indexOf('https') === -1"
              >
                DNS-over-HTTPS
              </option>
              <option
                value="httpsjson"
                :disabled="availableProtocols.indexOf('httpsjson') === -1"
              >
                DNS-over-HTTPS (JSON)
              </option>
            </select>
          </f7-list-item>

          <f7-block no-hairlines-md>
            <f7-row>
              <f7-col width="50" medium="25">
                <f7-button fill color="blue" @click="doResolve"
                  >Resolve</f7-button
                >
              </f7-col>
              <f7-col width="50" medium="25">
                <f7-button fill color="green">Import</f7-button>
              </f7-col>
              <f7-col width="0" medium="25" />
              <f7-col width="0" medium="25" />
            </f7-row>
          </f7-block>
        </f7-list>
      </f7-tab>
      <f7-tab id="dns" class="page-content">
        <f7-list media-list v-if="hasDetails">
          <f7-list-item
            class="title-wrap"
            v-for="entry in dnsDetails != null ? dnsDetails.result.Answer : []"
            v-bind:key="entry"
            :header="processType(entry.Type)"
            :title="processRdata(entry)"
            :footer="entry.TTL"
          >
          </f7-list-item>
          <f7-block-footer class="text-align-center"
            ><p>
              {{ dnsDetails.result.Metadata.RoundTripTime }}
            </p></f7-block-footer
          >
        </f7-list>
        <f7-list v-if="!hasDetails">
          <f7-list-item title="There are no items."></f7-list-item>
        </f7-list>
      </f7-tab>
      <f7-tab id="raw" class="page-content">
        <f7-block strong v-if="dnsDetailsRaw != ''">
          <p class="wrap">{{ dnsDetailsRaw }}</p>
        </f7-block>
        <f7-block strong v-if="dnsDetailsRaw == ''">
          <p class="wrap">Perform a Search in the Lookup.</p>
        </f7-block>
      </f7-tab>
    </f7-tabs>

    <dns-servers-selector
      @selected="selectDnsItem"
      :select="server"
    ></dns-servers-selector>
  </f7-page>
</template>
<style scoped>
.title-wrap :deep(.item-title),
.wrap {
  white-space: pre-wrap;
}
</style>
<script>
import DnsServersSelector from "@/components/dnsservers-selector.vue";
import { ref } from "vue";
import { f7, f7ready } from "framework7-vue";
import { dnsServers } from "@/assets/data/dnsservers";
import { dnsRecordTypes } from "@/assets/data/dnsrecordtypes";
import regex from "@/js/regex";
import api from "@/js/api";

export default {
  setup() {
    const type = ref("");
    const server = ref("");
    const domain = ref("");
    const protocol = ref("");
    const availableProtocols = ref([]);
    const dnsDetailsRaw = ref("");
    const dnsDetails = ref({});
    return {
      type,
      server,
      domain,
      protocol,
      availableProtocols,
      dnsDetailsRaw,
      dnsDetails,
    };
  },
  mounted() {
    f7ready((f7) => {
      this.defaultData();
    });
  },
  components: {
    DnsServersSelector,
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
    ...regex,
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
      if (drt != null) {
        pt = drt;
      }
      return pt + " Record";
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
    updateConfigParams: function (address) {
      var item = dnsServers.filter((f) => f.address == address)[0];

      if (item != null) {
        this.availableProtocols = item.protocol;
        this.$refs.protocolSS.$el
          .querySelector(".smart-select")
          .f7SmartSelect.setValue(item.protocol[0]);
      } else {
        this.availableProtocols = ["udp", "tcp", "tls", "https", "httpsjson"];
      }
    },
    serverChange: function (e) {
      this.updateConfigParams(this.server);
    },
    defaultData: function () {
      this.$refs.typeSS.$el
        .querySelector(".smart-select")
        .f7SmartSelect.setValue("A");

      this.server = "this-server";

      this.updateConfigParams(this.server);
    },
    selectDnsItem: function (address) {
      this.server = address;
      this.updateConfigParams(address);
    },
    doResolve: function () {
      if (f7.input.validateInputs(this.$refs.clientInputs.$el)) {
        f7.preloader.show();

        api
          .get("resolveQuery", [
            ["server", this.server],
            ["domain", this.domain],
            ["type", this.type],
            ["protocol", this.protocol],
          ])
          .then((res) => {
            this.dnsDetailsRaw = JSON.stringify(res, null, 2);
            this.dnsDetails = res;

            f7.tab.show("#dns");
          })
          .finally(() => {
            f7.preloader.hide();
          });
      }
    },
    doImport: function () {
      if (f7.input.validateInputs(this.$refs.clientInputs.$el)) {
        f7.dialog.confirm(
          "Importing all the records from the result of this query will overwrite existing records in the zone '" +
            this.domain +
            "'.\n\nAre you sure you want to import all records?",
          "Import Zone",
          () => {
            f7.preloader.show();

            api
              .get("resolveQuery", [
                ["server", this.server],
                ["domain", this.domain],
                ["type", this.type],
                ["protocol", this.protocol],
                ["import", "true"],
              ])
              .then((res) => {})
              .finally(() => {
                f7.preloader.hide();
              });
          },
          () => {}
        );
      }
    },
  },
};
</script>