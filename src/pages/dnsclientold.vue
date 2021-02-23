<template>
  <f7-page name="dnsclient">
    <f7-navbar title="DNS Client" back-link="Back"> </f7-navbar>

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
          <option selected>A</option>
          <option>NS</option>
          <option>CNAME</option>
          <option>SOA</option>
          <option>PTR</option>
          <option>MX</option>
          <option>TXT</option>
          <option>AAAA</option>
          <option>SRV</option>
          <option>CAA</option>
          <option>ANY</option>
          <option>AXFR</option>
          <option>ANAME</option>
          <option>FWD</option>
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
          <f7-col>
            <f7-button fill color="blue" @click="doResolve">Resolve</f7-button>
          </f7-col>
          <f7-col>
            <f7-button fill color="green">Import</f7-button>
          </f7-col>
        </f7-row>
      </f7-block>
    </f7-list>

    <f7-block-title>DNS Result Data</f7-block-title>
    <f7-list no-hairlines-md>
      <f7-list-input
        type="textarea"
        resizable
        readonly
        placeholder="Request Results"
        :value="dnsDetails"
      >
      </f7-list-input>
    </f7-list>
    
    <dns-servers-selector
      @selected="selectDnsItem"
      :select="server"
    ></dns-servers-selector>
  </f7-page>
</template>
<script>
import DnsServersSelector from "@/components/dnsservers-selector.vue";
import { ref } from "vue";
import { f7, f7ready } from "framework7-vue";
import { dnsServers } from "@/assets/data/dnsservers";
import regex from "@/js/regex";
import api from "@/js/api";

export default {
  setup() {
    const type = ref("");
    const server = ref("");
    const domain = ref("");
    const protocol = ref("");
    const availableProtocols = ref([]);
    const dnsDetails = ref("");
    return {
      type,
      server,
      domain,
      protocol,
      availableProtocols,
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
  methods: {
    ...regex,
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
            this.dnsDetails = JSON.stringify(res, null, 2);
          })
          .finally(() => {
            f7.preloader.hide();
          });
      }
    },
    doImport: function () {
      f7.preloader.show();
    },
  },
};
</script>