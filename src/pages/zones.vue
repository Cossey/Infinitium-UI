<template>
  <f7-page name="zones" ptr @ptr:refresh="fetchData" @page:beforeremove="onPageBeforeRemove">
    <f7-navbar title="Zones" back-link="Back">
      <f7-nav-right v-if="ios()">
        <f7-link icon-only icon-f7="plus" @click="newZone()"></f7-link>
      </f7-nav-right>
    </f7-navbar>
    <template #fixed v-if="!ios()">
      <f7-fab
        position="center-bottom"
        text="New"
        color="red"
        @click="newZone()"
      >
        <f7-icon ios="f7:plus" aurora="f7:plus" md="material:add"></f7-icon>
      </f7-fab>
    </template>
    <f7-list media-list>
      <template v-for="zone in zoneList" v-bind:key="zone">
        <f7-list-item
          swipeout
          @swipeout:deleted="removeZone(zone.name)"
          :link="'/zones/view/' + zone.name + '/'"
          :header="zoneTypeDisplay(zone)"
          :title="zone.name"
          :footer="zoneDisabled(zone.disabled)"
        >
          <f7-swipeout-actions right v-if="!zone.internal">
            <f7-swipeout-button
              delete
              confirm-text="Are you sure you want to delete this zone?"
            >
              Delete
            </f7-swipeout-button>
          </f7-swipeout-actions>
          <f7-swipeout-actions left v-if="!zone.internal">
            <f7-swipeout-button
              v-if="zone.disabled"
              color="green"
              @click="enableZone(zone.name)"
            >
              Enable
            </f7-swipeout-button>
            <f7-swipeout-button
              v-if="!zone.disabled"
              color="orange"
              @click="disableZone(zone.name)"
            >
              Disable
            </f7-swipeout-button>
          </f7-swipeout-actions>
        </f7-list-item>
      </template>
    </f7-list>
    <f7-block-footer class="text-align-center">
      <p>{{ zoneList.length }} items</p>
    </f7-block-footer>

    <!-- Add zone -->
    <f7-popup class="newZonePopup">
      <f7-page>
        <f7-navbar title="New Zone">
          <f7-nav-left>
            <f7-link popup-close>Cancel</f7-link>
          </f7-nav-left>
          <f7-nav-right>
            <f7-link @click="createZone()">Create</f7-link>
          </f7-nav-right>
        </f7-navbar>

        <f7-list no-hairlines-md>
          <f7-list-input
            required
            validate
            error-message="A domain is required"
            v-model:value="zoneName"
            label="Zone"
            type="text"
            placeholder="example.com or 192.168.0.1"
          ></f7-list-input>
        </f7-list>
        <f7-block-title>Type</f7-block-title>
        <f7-list>
          <f7-list-item
            radio
            name="zoneType"
            value="primary"
            title="Primary Zone"
            :checked="zoneType === 'primary'"
            @change="zoneType = $event.target.value"
          ></f7-list-item>
          <f7-list-item
            radio
            name="zoneType"
            value="secondary"
            title="Secondary Zone"
            :checked="zoneType === 'secondary'"
            @change="zoneType = $event.target.value"
          ></f7-list-item>
          <f7-list-item
            radio
            name="zoneType"
            value="stub"
            title="Stub Zone"
            :checked="zoneType === 'stub'"
            @change="zoneType = $event.target.value"
          ></f7-list-item>
          <f7-list-item
            radio
            name="zoneType"
            value="forwarder"
            title="Conditional Forwarder Zone"
            :checked="zoneType === 'forwarder'"
            @change="zoneType = $event.target.value"
          ></f7-list-item>
        </f7-list>
        <f7-list no-hairlines-md v-show="showNameServer()">
          <f7-list-input
            type="textarea"
            label="Primary Name Server (optional)"
            placeholder="192.168.1.1"
            resizable
          ></f7-list-input>
        </f7-list>
        <f7-block-title v-show="showForwardOptions()">Server</f7-block-title>
        <f7-list v-show="showForwardOptions()">
          <f7-list-item
            radio
            name="zoneServer"
            value="internal"
            title="Use this DNS Server"
            :checked="zoneServer === 'internal'"
            @change="zoneServer = $event.target.value"
          ></f7-list-item>
          <f7-list-item
            radio
            name="zoneServer"
            value="external"
            title="External DNS Server"
            :checked="zoneServer === 'external'"
            @change="zoneServer = $event.target.value"
          ></f7-list-item>
        </f7-list>
        <f7-block-title v-show="showExternalDNSServerOptions()"
          >zoneProtocol</f7-block-title
        >
        <f7-list v-show="showExternalDNSServerOptions()">
          <f7-list-item
            radio
            name="zoneProtocol"
            value="Udp"
            title="DNS-over-UDP"
            :checked="zoneProtocol === 'Udp'"
            @change="zoneProtocol = $event.target.value"
          ></f7-list-item>
          <f7-list-item
            radio
            name="zoneProtocol"
            value="Tcp"
            title="DNS-over-TCP"
            :checked="zoneProtocol === 'Tcp'"
            @change="zoneProtocol = $event.target.value"
          ></f7-list-item>
          <f7-list-item
            radio
            name="zoneProtocol"
            value="Tls"
            title="DNS-over-TLS"
            :checked="zoneProtocol === 'Tls'"
            @change="zoneProtocol = $event.target.value"
          ></f7-list-item>
          <f7-list-item
            radio
            name="zoneProtocol"
            value="Https"
            title="DNS-over-HTTPS"
            :checked="zoneProtocol === 'Https'"
            @change="zoneProtocol = $event.target.value"
          ></f7-list-item>
          <f7-list-item
            radio
            name="zoneProtocol"
            value="json"
            title="DNS-over-HTTPS (JSON)"
            :checked="zoneProtocol === 'json'"
            @change="zoneProtocol = $event.target.value"
          ></f7-list-item>
        </f7-list>
        <f7-list no-hairlines-md v-show="showExternalDNSServerOptions()">
          <f7-list-input
            required
            validate
            error-message="A forwarding server address is required."
            v-model:value="zoneForwardServer"
            type="text"
            title="Server Address"
            placeholder="8.8.8.8 or [2620:fe::10]"
            clear-button
          ></f7-list-input>
        </f7-list>
      </f7-page>
    </f7-popup>
  </f7-page>
</template>
<script>
import api from "../js/api";
import store from "../js/store";
import { f7, f7ready, theme } from "framework7-vue";
import { reactive, ref } from "vue";

export default {
  setup() {
    const zoneType = ref("primary");
    const zoneNS = ref("");
    const zoneName = ref("");
    const zoneProtocol = ref("Udp");
    const zoneForwardServer = ref("");
    const zoneServer = ref("internal");
    const zoneList = ref([]);

    return {
      zoneType,
      zoneNS,
      zoneName,
      zoneProtocol,
      zoneForwardServer,
      zoneServer,
      zoneList
    };
  },
  mounted() {
    f7ready((f7) => {
      this.fetchData();
    });
  },
  methods: {
    ios: function () {
      return theme.ios;
    },
    createZone: function () {
      f7.input.validateInputs("#zone-add");

      if (this.zoneName === "") return;
      if (
        this.zoneServer === "external" &&
        this.zoneType === "forwarder" &&
        this.zoneForwardServer === ""
      )
        return;

      var params = [
        ["domain", this.zoneName],
        ["zoneType", this.zoneType],
      ];

      if (this.zoneType === "stub" || this.zoneType === "secondary") {
        if (this.zoneNS.length > 0) {
          var nsList = this.zoneNS.replace("\r\n", ", ");
          params.push(["primaryNameServerAddresses", nsList]);
        }
      }

      if (this.zoneType === "forwarder") {
        params.push(["zoneProtocol", this.zoneProtocol]);

        if (this.zoneServer === "internal") {
          params.push(["forwarder", "this-zoneServer"]);
        } else {
          params.push(["forwarder", this.zoneForwardServer]);
        }
      }
      const self = this;

      api.get("createZone", params).then((res) => {
        self.popup.close();
        self.fetchData();
      });
    },
    showExternalDNSServerOptions: function () {
      if (!this.showForwardOptions()) {
        return this.showForwardOptions();
      }
      return this.zoneServer === "external";
    },
    showNameServer: function () {
      return this.zoneType === "secondary" || this.zoneType === "stub";
    },
    showForwardOptions: function () {
      return this.zoneType === "forwarder";
    },
    newZone: function () {
      const self = this;
      if (!self.popup) {
          self.popup = f7.popup.create({
            el: '.newZonePopup'
          });
      }
      self.popup.open();
    },
    removeZone: function (zoneName) {
      api.delete("Zone", "domain", "name", zoneName, this.zoneList);
    },
    disableZone: function (zoneName) {
      api.get("disableZone", [["domain", zoneName]]).then((data) => {
        this.fetchData();
      });
    },
    enableZone: function (zoneName) {
      api.get("enableZone", [["domain", zoneName]]).then((data) => {
        this.fetchData();
      });
    },
    fetchData: function (done) {
      api.get("listZones").then((data) => {
        this.zoneList = data.zones;
        if (typeof done !== "undefined") done();
      });
    },
    zoneTypeDisplay: function (zone) {
      if (zone.internal) {
        return "Internal";
      } else {
        return zone.type;
      }
    },
    zoneDisabled: function (zoneDisabled) {
      if (zoneDisabled) {
        return "Disabled";
      }
    },
    onPageBeforeRemove() {
        const self = this;
        // Destroy popup when page removed
        if (self.popup) self.popup.destroy();
      },
  },
};
</script>