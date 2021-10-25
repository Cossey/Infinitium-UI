<template>
  <f7-page name="tools">
    <f7-navbar>
      <f7-nav-left>
        <f7-link
          icon-ios="f7:menu"
          icon-aurora="f7:menu"
          icon-md="material:menu"
          panel-open="left"
        ></f7-link>
      </f7-nav-left>
      <f7-nav-title sliding>Tools</f7-nav-title>
    </f7-navbar>

    <f7-block-title>Caching</f7-block-title>
    <flush-cache></flush-cache>

    <f7-block-title>Blocklist</f7-block-title>
    <blocklists-temp-disable
      :disableBlockingTill="settings.temporaryDisableBlockingTill"
    ></blocklists-temp-disable>

    <f7-block-title>Settings</f7-block-title>
    <f7-list>
      <f7-list-item link="/settings/backup/" title="Backup"></f7-list-item>
      <f7-list-item link="/settings/restore/" title="Restore"></f7-list-item>
    </f7-list>
  </f7-page>
</template>
<script>
import api from "@/js/api";
import { f7, f7ready } from "framework7-vue";
import BlocklistsTempDisable from "@/components/blocklists-temp-disable.vue";
import FlushCache from "@/components/flush-cache.vue";
import { ref } from "vue";
import SettingsBackupPopup from "./settings-backup.vue";

export default {
  components: {
    BlocklistsTempDisable,
    FlushCache,
  },
  mounted() {
    f7ready((f7) => {
      this.fetchData();
    });
  },
  setup() {
    const settings = ref({});
    return {
      settings,
    };
  },
  props: {
    f7router: Object,
  },
  methods: {
    fetchData: function (done) {
      api.get("getDnsSettings").then((data) => {
        this.settings = data;

        f7.store.dispatch('domain', data.dnsServerDomain);
      });
    },
    openBackup: function () {
      this.f7router.navigate({
        url: "backup",
        route: {
          path: "backup",
          component: SettingsBackupPopup,
        },
      });
    },
  },
  computed: {
    //
  },
};
</script>