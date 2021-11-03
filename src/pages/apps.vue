<template>
     <f7-page name="apps" :page-content="false">
    <f7-navbar title="Apps">
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
        route-tab-id="installed"
        text="Installed"
        icon-ios="f7:keyboard"
        icon-aurora="material:keyboard"
        icon-md="material:keyboard"
      ></f7-link>
      <f7-link
        tab-link
        href="store/"
        route-tab-id="store"
        text="Store"
        icon-ios="f7:cart"
        icon-aurora="material:shopping_cart"
        icon-md="material:shopping_cart"
      ></f7-link>
    </f7-toolbar>
    <f7-tabs routable>
      <f7-tab id="installed" class="page-content"></f7-tab>
      <f7-tab id="store" class="page-content"></f7-tab>
    </f7-tabs>
  </f7-page>
</template>
<script>
export default {
    
}
</script>