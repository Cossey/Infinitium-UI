<template>
  <f7-popup class="dnsservers-selector" @popup:closed="closePopup">
    <f7-page with-subnavbar>
      <f7-navbar title="Select DNS Server">
        <f7-nav-right>
          <f7-link popup-close>Close</f7-link>
        </f7-nav-right>
        <f7-subnavbar :inner="false">
          <f7-searchbar
            disable-button-text="Cancel"
            :disable-button="!theme.aurora"
            placeholder="Search DNS Servers"
            :clear-button="theme.aurora"
            search-container=".search-list"
            search-in=".item-title, .item-subtitle"
          ></f7-searchbar>
        </f7-subnavbar>
      </f7-navbar>

      <f7-list class="searchbar-not-found">
        <f7-list-item title="There are no results."> </f7-list-item>
      </f7-list>

      <f7-list media-list class="search-list searchbar-found">
        <template v-for="item in dnsServers" v-bind:key="item">
          <f7-list-item
            radio
            class="dnsItem"
            name="dnsItem"
            :value="item.address"
            :title="item.name"
            :subtitle="item.address"
            @change="listChange"
            @taphold="listMenu"
            @contextmenu="listMenu"
            :checked="select === item.address"
          >
          </f7-list-item>
        </template>
      </f7-list>
    </f7-page>
  </f7-popup>
</template>
<script>
import { dnsServers } from "@/assets/data/dnsservers";
import { f7, theme } from "framework7-vue";

export default {
  props: ["select"],
  computed: {
    theme() {
      return theme;
    },
    dnsServers() {
      return dnsServers;
    },
  },
  methods: {
    closePopup() {
      this.$emit("selected", f7.$(".dnsItem input:checked").prop("value"));
    },
  },
};
</script>