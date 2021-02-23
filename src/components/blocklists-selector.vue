<template>
  <f7-popup class="blocklists-selector" @popup:closed="closePopup">
    <f7-page with-subnavbar>
      <f7-navbar title="Select Blocklists">
        <f7-nav-right>
          <f7-link popup-close>Close</f7-link>
        </f7-nav-right>
        <f7-subnavbar :inner="false">
          <f7-searchbar
            disable-button-text="Cancel"
            :disable-button="!theme.aurora"
            placeholder="Search Blocklists"
            :clear-button="theme.aurora"
            search-container=".search-list"
            search-in=".item-title, .item-after, .item-text"
          ></f7-searchbar>
        </f7-subnavbar>
      </f7-navbar>

      <f7-list class="searchbar-not-found">
        <f7-list-item title="There are no results."> </f7-list-item>
      </f7-list>

      <f7-list media-list class="search-list searchbar-found">
        <template v-for="item in blockLists" v-bind:key="item">
          <f7-list-item
            swipeout
            checkbox
            class="blockListItem"
            :value="item.url"
            :title="item.name"
            :after="item.maintainer"
            :text="getCategories(item.categories)"
            @change="listChange"
            @taphold="listMenu"
            @contextmenu="listMenu"
          >
            <f7-swipeout-actions right>
              <f7-swipeout-button
                v-if="item.website != null"
                @click="openWebsite(item.website)"
                >Website</f7-swipeout-button
              >
            </f7-swipeout-actions>
          </f7-list-item>
        </template>
      </f7-list>
    </f7-page>
  </f7-popup>
</template>
<script>
import { ref } from "vue";
import { blockLists } from "@/assets/data/blocklists";
import { f7, theme } from "framework7-vue";

export default {
  props: {
    selected: [],
  },
  setup() {
    const selectedBlockLists = ref([]);

    return {
      selectedBlockLists,
    };
  },
  computed: {
    theme() {
      return theme;
    },
    blockLists() {
      return blockLists;
    },
  },
  methods: {
    listMenu(e) {
      f7.dialog.alert("Taphold");
      console.log(e.target);
    },
    openWebsite(website) {
      window.open(website, "_blank");
    },
    getCategories(categories) {
      return categories.join(", ");
    },
    closePopup() {
      if (this.selectedBlockLists.length > 0) {
        this.$emit("selected", this.selectedBlockLists);
        this.selectedBlockLists = [];
        f7.$(".blockListItem input").prop("checked", false);
      }
    },
    listChange(e) {
      if (e.target.checked) {
        this.selectedBlockLists.push(e.target.value);
      } else {
        var index = this.selectedBlockLists.indexOf(e.target.value);
        if (index !== -1) {
          this.selectedBlockLists.splice(index, 1);
        }
      }
    },
  },
};
</script>