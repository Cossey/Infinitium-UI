<template>
  <f7-page name="zones" ptr @ptr:refresh="fetchData">
    <f7-navbar title="Zones">
      <template v-slot:left>
        <f7-link
          icon-ios="f7:menu"
          icon-aurora="material:menu"
          icon-md="material:menu"
          panel-open="left"
        ></f7-link>
      </template>
      <template v-slot:right>
        <f7-link v-if="$theme.ios" text="Add" @click="newZone()"></f7-link>
      </template>
    </f7-navbar>
    <template #fixed v-if="!$theme.ios">
      <f7-fab position="center-bottom" text="Add" color="red" @click="newZone()">
        <f7-icon ios="f7:plus" aurora="f7:plus" md="material:add"></f7-icon>
      </f7-fab>
    </template>
    <f7-list media-list>
      <template v-for="zone in zoneList" v-bind:key="zone">
        <f7-list-item
          :swipeout="!$device.desktop"
          @swipeout:deleted="removeZone(zone.name)"
          :link="'' + zone.name + '/view/'"
          :title="zone.name"
          :subtitle="(typeof zone.expiry !== 'undefined' ? 'Expiry ' + dateFormat(zone.expiry) : '')"
        >
          <template v-slot:after>
            <f7-badge
              :color="zone.internal ? 'gray' : 'blue'"
            >{{ zone.internal ? 'Internal' : zone.type }}</f7-badge>&nbsp;
            <f7-badge
              v-if="zone.disabled || zone.isExpired"
              color="red"
            >{{ zone.disabled ? 'Disabled' : (zone.isExpired ? 'Expired' : '') }}</f7-badge>
          </template>
          <template v-if="!$device.desktop">
            <f7-swipeout-actions right v-if="!zone.internal">
              <f7-swipeout-button
                delete
                confirm-text="Are you sure you want to delete this zone?"
              >Delete</f7-swipeout-button>
            </f7-swipeout-actions>
            <f7-swipeout-actions left v-if="!zone.internal">
              <f7-swipeout-button
                v-if="zone.disabled"
                color="green"
                @click="enableZone(zone.name)"
              >Enable</f7-swipeout-button>
              <f7-swipeout-button
                v-if="!zone.disabled"
                color="orange"
                @click="disableZone(zone.name)"
              >Disable</f7-swipeout-button>
            </f7-swipeout-actions>
          </template>
        </f7-list-item>
      </template>
    </f7-list>
    <f7-block-footer class="text-align-center">
      <p>{{ zoneList.length }} total zones</p>
    </f7-block-footer>
  </f7-page>
</template>
<script>
import { f7ready } from "framework7-vue";

export default {
  data() {
    return {
      zoneList: [],
    }
  },
  props: {
    f7router: Object,
  },
  mounted() {
    f7ready((f7) => {
      this.fetchData();

      f7.on("zoneCreated", (zoneName) => { this.fetchData() });
      f7.on("zoneDeleted", (zoneName) => { this.fetchData() });
      f7.on("zoneDisabled", (zoneName) => { this.fetchData() });
      f7.on("zoneEnabled", (zoneName) => { this.fetchData() });
    });
  },
  methods: {
    newZone() {
      this.f7router.navigate("new/");
    },
    dateFormat(date) {
      if (!date) return null;
      return new Date(date).toLocaleString();
    },
    removeZone: function (zoneName) {
      this.$api.delete("Zone", "domain", "name", zoneName, this.zoneList);
    },
    disableZone: function (zoneName) {
      this.$api.get("disableZone", [["domain", zoneName]]).then((data) => {
        this.fetchData();
      });
    },
    enableZone: function (zoneName) {
      this.$api.get("enableZone", [["domain", zoneName]]).then((data) => {
        this.fetchData();
      });
    },
    fetchData: function (done) {
      this.$api.get("listZones").then((data) => {
        this.zoneList = data.zones;
        if (typeof done !== "undefined") done();
      });
    },
  },
};
</script>