<template>
  <f7-page>
    <f7-navbar back-link="Tools" title="Backup Settings">
      <f7-nav-right>
        <f7-link @click="doBackup">Backup</f7-link>
      </f7-nav-right>
    </f7-navbar>
    <f7-list no-hairlines-md>
      <f7-list-item
        checkbox
        title="DNS Settings File"
        after="dns.config"
        v-model:checked="backup.dnsSettings"
      ></f7-list-item>
      <f7-list-item
        checkbox
        title="Log Settings File"
        after="log.config"
        v-model:checked="backup.logSettings"
      ></f7-list-item>
      <f7-list-item
        checkbox
        title="DNS Zone Files"
        after="*.zone"
        v-model:checked="backup.zones"
      ></f7-list-item>
      <f7-list-item
        checkbox
        title="Allowed Zones File"
        after="allowed.config"
        v-model:checked="backup.allowedZones"
      ></f7-list-item>
      <f7-list-item
        checkbox
        title="Blocked Zones File"
        after="blocked.config"
        v-model:checked="backup.blockedZones"
      ></f7-list-item>
      <f7-list-item
        checkbox
        title="DHCP Scope Files"
        after="*.scope"
        v-model:checked="backup.scopes"
      ></f7-list-item>
      <f7-list-item
        checkbox
        title="DNS Apps"
        v-model:checked="backup.apps"
      ></f7-list-item>
      <f7-list-item
        checkbox
        title="Dashboard Stats Files"
        after="*.stat, *.dstat"
        v-model:checked="backup.stats"
      ></f7-list-item>
      <f7-list-item
        checkbox
        title="Log Files"
        after="*.log"
        v-model:checked="backup.logs"
      ></f7-list-item>
      <f7-list-item
        checkbox
        title="Block List Cache Files"
        v-model:checked="backup.blockLists"
      ></f7-list-item>
    </f7-list>
  </f7-page>
</template>
<script>
import api from "../js/api";
export default {
  data() {
    return {
      backup: {
        dnsSettings: false,
        logSettings: false,
        zones: false,
        allowedZones: false,
        blockedZones: false,
        scopes: false,
        apps: false,
        stats: false,
        logs: false,
        blockLists: false,
      },
    };
  },
  methods: {
    doBackup: function () {
      var url = api.buildUrl(
        "backupSettings",
        api.serializeParams(this.backup, [])
      );

      window.location.replace(url);
    },
  },
};
</script>