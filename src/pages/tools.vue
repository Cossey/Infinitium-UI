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
    <f7-block-title>Misc</f7-block-title>
    <f7-list>
      <f7-list-item @click="flushCache()" title="Flush Cache"></f7-list-item>
    </f7-list>

    <f7-block-title>Blocklist</f7-block-title>
    <f7-list>
      <f7-list-item
        header="Next Update On"
        :title="settings.blockListNextUpdatedOn"
      >
      </f7-list-item>
      <f7-list-button
        @click="updateBlockLists()"
        title="Update Blocklists Now"
      ></f7-list-button>
    </f7-list>
    <f7-list>
      <p>Not Set</p>
      <f7-list-input label="Disable for" type="text" placeholder="minutes">
      </f7-list-input>
      <f7-list-button
        @click="tempDisableBL()"
        title="Temporarily Disable Blocklist"
      ></f7-list-button>
    </f7-list>

    <f7-block-title>Settings</f7-block-title>
    <f7-list>
      <f7-list-item link="/tools/backup" title="Backup"></f7-list-item>
      <f7-list-item link="/tools/restore" title="Restore"></f7-list-item>
    </f7-list>
  </f7-page>
</template>
<script>
export default {
  data() {
    return {
      //
    };
  },
  methods: {
    flushCache: function () {
      api.get("flushDnsCache").then((res) => {
        f7.dialog.alert("Cache Flushed Succesfully.");
      });
    },
  },
  computed: {
    //
  },
  mounted() {
    //
  },
  components: {
    //
  },
};
</script>