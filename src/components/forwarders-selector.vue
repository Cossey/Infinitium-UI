<template>
  <f7-popup class="forwarders-selector" @popup:closed="closePopup">
    <f7-page>
      <f7-navbar title="Select Forwarders">
        <f7-nav-right>
          <f7-link popup-close>Close</f7-link>
        </f7-nav-right>
      </f7-navbar>

      <f7-block>
        <p>Only forwarders for the chosen protocol are shown below.</p>
      </f7-block>

      <f7-list>
        <f7-list-item
          v-for="forwarder in this.protocol != null
            ? forwarders.filter((f) => f.type == this.protocol.toLowerCase())
            : []"
          v-bind:key="forwarder"
          checkbox
          class="forwarderItem"
          :value="forwarder.addresses"
          :title="forwarder.name"
          @change="listChange"
        ></f7-list-item>
      </f7-list>
    </f7-page>
  </f7-popup>
</template>
<script>
import { forwarders } from "@/assets/data/forwarders";
import { ref } from "vue";
import { f7 } from "framework7-vue";

export default {
  props: ["protocol"],
  setup() {
    const selectedForwarders = ref([]);

    return {
      selectedForwarders,
    };
  },
  computed: {
    forwarders() {
      return forwarders;
    },
  },
  methods: {
    closePopup() {
      if (this.selectedForwarders.length > 0) {
        this.$emit("selected", this.selectedForwarders);
        this.selectedForwarders = [];
        f7.$(".forwarderItem input").prop("checked", false);
      }
    },
    listChange(e) {
      if (e.target.checked) {
        this.selectedForwarders.push(e.target.value);
      } else {
        var index = this.selectedForwarders.indexOf(e.target.value);
        if (index !== -1) {
          this.selectedForwarders.splice(index, 1);
        }
      }
    },
  },
};
</script>