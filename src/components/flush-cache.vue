<template>
  <f7-list no-hairlines-md>
    <f7-list-button @click="flushCache()" title="Flush Cache"> </f7-list-button>
  </f7-list>
</template>
<script>
import api from "@/js/api";
import { f7 } from "framework7-vue";

export default {
  methods: {
    flushCache: function () {
      const self = this;
      f7.dialog.confirm("Are you sure you want to flush the DNS server cache?", () => {
        api.get("flushDnsCache").then((res) => {
          // Create toast
          if (!self.flushToast) {
            self.flushToast = f7.toast.create({
              text: "Flushed Cache",
              closeTimeout: 3000,
              horizontalPosition: "center",
            });
          }
          // Open it
          self.flushToast.open();
        });
      });
    },
  },
};
</script>