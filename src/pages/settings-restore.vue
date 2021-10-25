<template>
  <f7-page>
    <f7-navbar back-link="Tools" title="Restore Settings">
      <template v-slot:right>
        <f7-link @click="dorestore">Restore</f7-link>
      </template>
    </f7-navbar>
    <f7-list no-hairlines-md></f7-list>
    <f7-list no-hairlines-md>
      <f7-list-item
        checkbox
        title="DNS Settings File"
        after="dns.config"
        v-model:checked="restore.dnsSettings"
      ></f7-list-item>
      <f7-list-item
        checkbox
        title="Log Settings File"
        after="log.config"
        v-model:checked="restore.logSettings"
      ></f7-list-item>
      <f7-list-item checkbox title="DNS Zone Files" after="*.zone" v-model:checked="restore.zones"></f7-list-item>
      <f7-list-item
        checkbox
        title="Allowed Zones File"
        after="allowed.config"
        v-model:checked="restore.allowedZones"
      ></f7-list-item>
      <f7-list-item
        checkbox
        title="Blocked Zones File"
        after="blocked.config"
        v-model:checked="restore.blockedZones"
      ></f7-list-item>
      <f7-list-item
        checkbox
        title="DHCP Scope Files"
        after="*.scope"
        v-model:checked="restore.scopes"
      ></f7-list-item>
      <f7-list-item checkbox title="DNS Apps" v-model:checked="restore.apps"></f7-list-item>
      <f7-list-item
        checkbox
        title="Dashboard Stats Files"
        after="*.stat, *.dstat"
        v-model:checked="restore.stats"
      ></f7-list-item>
      <f7-list-item checkbox title="Log Files" after="*.log" v-model:checked="restore.logs"></f7-list-item>
      <f7-list-item checkbox title="Block List Cache Files" v-model:checked="restore.blockLists"></f7-list-item>
    </f7-list>
    <f7-list no-hairlines-md>
      <f7-list-item
        checkbox
        title="Delete Existing Files For Existing Items"
        v-model:checked="restore.deleteExistingFiles"
      ></f7-list-item>
      <f7-block-footer>
        <p>
          The restore process will overwrite existing config files on disk for
          above selected items and reload new settings including passwords. If
          you do not remember the password used while creating the backup, you
          should reset the admin password immediately after restoring the
          backup. Failing to do so will require you to follow the password reset
          process.
        </p>
      </f7-block-footer>
    </f7-list>
  </f7-page>
</template>
<script>
import api from "../js/api";
export default {
  data() {
    return {
      restore: {
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
        deleteExistingFiles: false,
      },
    };
  },
  methods: {
    dorestore: function () {
      var url = api.buildUrl(
        "restoreSettings",
        api.serializeParams(this.restore, [])
      );

      window.location.replace(url);
    },
  },
};
</script>