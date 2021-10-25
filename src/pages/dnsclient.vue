<template>
  <f7-page name="dnsclient">
    <f7-navbar title="DNS Client">
      <template v-slot:left>
        <f7-link
          icon-ios="f7:menu"
          icon-aurora="f7:menu"
          icon-md="material:menu"
          panel-open="left"
        ></f7-link>
      </template>
    </f7-navbar>
    <f7-list inline-labels no-hairlines-md ref="clientInputs">
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
    </f7-list>

    <f7-list inline-labels no-hairlines-md ref="domainInputs">
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

      <f7-block strong no-hairlines-md>
        <f7-row>
          <f7-col width="50" medium="25">
            <f7-button color="blue" @click="doResolve">Resolve</f7-button>
          </f7-col>
          <f7-col width="50" medium="25">
            <f7-button color="green" @click="doImport">Import</f7-button>
          </f7-col>
          <f7-col width="0" medium="25" />
          <f7-col width="0" medium="25" />
        </f7-row>
      </f7-block>
    </f7-list>

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
import DNSClientResultPopup from "./dnsclient-results.vue";

export default {
  setup() {
    const type = ref("");
    const server = ref("");
    const domain = ref("");
    const protocol = ref("");
    const availableProtocols = ref([]);
    return {
      type,
      server,
      domain,
      protocol,
      availableProtocols,
    };
  },
  mounted() {
    f7ready((f7) => {
      this.defaultData();
    });
  },
  props: {
    f7router: Object,
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
      if (
        f7.input.validateInputs(this.$refs.clientInputs.$el) &&
        f7.input.validateInputs(this.$refs.domainInputs.$el)
      ) {
        f7.dialog.preloader("Resolving...");

        api
          .get("resolveQuery", [
            ["server", this.server],
            ["domain", this.domain],
            ["type", this.type],
            ["protocol", this.protocol],
          ])
          .then((res) => {
            this.f7router.navigate("/client/results/", {
              props: {
                dnsDetails: res,
                dnsDetailsRaw: JSON.stringify(res, null, 2),
              },
            });
          })
          .finally(() => {
            f7.dialog.close();
          });
      }
    },
    doImport: function () {
      if (
        f7.input.validateInputs(this.$refs.clientInputs.$el) &&
        f7.input.validateInputs(this.$refs.domainInputs.$el)
      ) {
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