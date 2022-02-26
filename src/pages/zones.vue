<template>
  <f7-page name="zones" ptr @ptr:refresh="fetchData">
    <f7-navbar :title="$t('zones.title')">
      <template v-slot:left>
        <f7-link
          icon-ios="f7:menu"
          icon-aurora="material:menu"
          icon-md="material:menu"
          panel-open="left"
        ></f7-link>
      </template>
      <template v-slot:right>
        <f7-link v-if="$theme.ios" :text="$t('zones.add')" @click="newZone()"></f7-link>
      </template>
      <f7-subnavbar>
        <f7-searchbar
          search-container=".media-list"
          search-item=".media-item"
          search-in=".item-title"
          :placeholder="$t('misc.search')"
          :disable-button="!$theme.aurora"
        />
      </f7-subnavbar>
    </f7-navbar>
    <template #fixed v-if="!$theme.ios">
      <f7-fab position="right-bottom" :tooltip="$t('zones.add')" color="red" @click="newZone()">
        <f7-icon ios="f7:plus" aurora="f7:plus" md="material:add"></f7-icon>
      </f7-fab>
    </template>
    <f7-list class="searchbar-not-found">
      <f7-list-item title="No results found" />
    </f7-list>
    <f7-list media-list v-if="loading">
      <f7-list-item
        v-for="n in 10"
        :key="n"
        class="skeleton-text skeleton-effect-wave"
        title="____________"
      />
    </f7-list>
    <f7-list class="searchbar-found" v-if="!loading">
      <template v-for="zone in zoneList" v-bind:key="zone">
        <f7-list-item
          :swipeout="!$device.desktop"
          @swipeout:deleted="removeZone(zone.name)"
          :link="'' + zone.name + '/view/'"
          :title="zone.name"
          :subtitle="(typeof zone.expiry !== 'undefined' ? 'Expiry ' + dateFormat(zone.expiry) : '')"
          @contextmenu="cmShow($event, zone)"
        >
          <template v-slot:after>
            <f7-badge
              :color="zone.internal ? 'gray' : 'blue'"
            >{{ zone.internal ? this.$t('zones.internal') : translateZoneType(zone.type) }}</f7-badge>&nbsp;
            <f7-badge
              v-if="zone.disabled || zone.isExpired"
              color="red"
            >{{ zone.disabled ? this.$t('zones.disabled') : (zone.isExpired ? this.$t('zones.expired') : '') }}</f7-badge>
          </template>
          <template v-if="!$device.desktop">
            <f7-swipeout-actions right v-if="!zone.internal">
              <f7-swipeout-button
                delete
                :confirm-text="$t('zones.deleteconfirm')"
                v-t="'zones.delete'"
              />
            </f7-swipeout-actions>
            <f7-swipeout-actions left v-if="!zone.internal">
              <f7-swipeout-button
                v-if="zone.disabled"
                color="green"
                @click="enableZone(zone.name)"
                v-t="'zones.enable'"
              />
              <f7-swipeout-button
                v-if="!zone.disabled"
                color="orange"
                @click="disableZone(zone.name)"
                v-t="'zones.disable'"
              />
            </f7-swipeout-actions>
          </template>
        </f7-list-item>
      </template>
    </f7-list>
    <f7-block-footer class="text-align-center">
      <p v-t="{ path: 'zones.zones', args: { n: zoneList.length } }" />
    </f7-block-footer>
  </f7-page>
</template>

<script>
import { f7, f7ready } from "framework7-vue";
import { ref } from '@vue/reactivity';
import { loadLocaleMessages } from '../js/i18n';
import ContextMenuMixin from "@/components/context-menu-mixin";


export default {
  i18n: {
    messages: loadLocaleMessages(require.context('@/assets/i18n/zones'))
  },
  mixins: [ContextMenuMixin],
  data() {
    return {
      zoneList: [],
      loading: ref(true),
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

      this.contextMenuItems = [
        {
          label: 'zones.options',
          icon: "settings",
          onClick: (zone) => {
            this.zoneOptions(zone.name)
          },
          visible: (zone) => (zone.type === 'Primary' || zone.type === 'Secondary') && !zone.internal,
          divided: (zone) => zone.type === 'Primary'
        },
        {
          label: 'zones.resync',
          icon: "sync",
          onClick: (zone) => {
            this.resyncZone(zone.name)
          },
          visible: (zone) => (zone.type === 'Stub' || zone.type === 'Secondary') && !zone.internal,
          divided: true,
        },
        {
          label: 'zones.disable',
          icon: "disable",
          onClick: (zone) => {
            this.disableZone(zone.name)
          },
          visible: (zone) => !zone.disabled && !zone.internal,
        },
        {
          label: 'zones.enable',
          icon: "enable",
          onClick: (zone) => {
            this.enableZone(zone.name)
          },
          visible: (zone) => zone.disabled && !zone.internal,
        },
        {
          label: 'zones.deletezone',
          icon: "delete",
          onClick: (zone) => {
            f7.dialog.confirm(
              this.$t('zones.deleteconfirm'),
              this.$t('zones.deletezone'),
              () => {
                this.removeZone(zone.name);
              });
          },
          visible: (zone) => !zone.internal,
        },
      ];
    });
  },
  methods: {
    newZone() {
      this.f7router.navigate("new/");
    },
    translateZoneType(zoneType) {
      return this.$t(`zones.type.${zoneType.toLowerCase()}`);
    },
    dateFormat(date) {
      if (!date) return null;
      return new Date(date).toLocaleString();
    },
    resyncZone: function (zoneName) {
      f7.dialog.confirm(this.$t('zones.view.resyncconfirm'), () => {
        this.$api.get("zone/resync", [
          ["domain", zoneName]
        ]).then((res) => {
          this.fetchData();
        });
      });
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
        this.loading = false;
        if (typeof done !== "undefined") done();
      });
    },
    zoneOptions(zone) {
      this.f7router.navigate("/zones/" + zone + "/options/");
    },
  },
};
</script>