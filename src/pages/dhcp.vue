<template>
  <f7-page name="dhcp" :page-content="false">
    <f7-navbar title="DHCP">
      <template v-slot:left>
        <f7-link
          icon-ios="f7:menu"
          icon-aurora="material:menu"
          icon-md="material:menu"
          panel-open="left"
        ></f7-link>
      </template>
    </f7-navbar>
    <f7-toolbar tabbar labels bottom>
      <f7-link
        tab-link
        href="./"
        route-tab-id="leases"
        text="Leases"
        icon-ios="f7:number"
        icon-aurora="material:tag"
        icon-md="f7:number"
      ></f7-link>
      <f7-link
        tab-link
        href="scopes/"
        route-tab-id="scopes"
        text="Scopes"
        icon-ios="f7:scope"
        icon-aurora="material:adjust"
        icon-md="f7:scope"
      ></f7-link>
    </f7-toolbar>
    <f7-tabs routable>
      <f7-tab id="leases" class="page-content"></f7-tab>
      <f7-tab id="scopes" class="page-content"></f7-tab>
    </f7-tabs>
  </f7-page>
</template>
<script>
export default {};
</script>