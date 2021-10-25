<template>
  <div class="ptr-content" @ptr:refresh="fetchData">
    <div class="ptr-preloader">
      <div class="preloader"></div>
      <div class="ptr-arrow"></div>
    </div>
    <f7-list media-list v-if="leases.length > 0">
      <f7-list-group :key="group" v-for="group in leaseGroup">
        <f7-list-item :title="group[0].scope" group-title></f7-list-item>
        <f7-list-item
          :key="lease"
          v-for="lease in group"
          :header="lease.type"
          :title="lease.address"
          :subtitle="lease.hostName"
          :text="lease.hardwareAddress"
          :after="lease.leaseExpires"
        ></f7-list-item>
      </f7-list-group>
    </f7-list>
    <f7-block v-else class="text-align-center">
      <p>
        <i class="f7-icons if-ios" style="font-size: 100pt">nosign</i>
        <i class="material-icons if-not-ios" style="font-size: 100pt">block</i>
      </p>
      <p>There are no DHCP Leases</p>
    </f7-block>
  </div>
</template>
<script>
import api from "@/js/api";
import { f7, f7ready, theme } from "framework7-vue";
import { ref } from "vue";

export default {
  mounted() {
    f7ready((f7) => {
      this.fetchData();
    });
  },
  data() {
    return {
      leases: ref([]),
    };
  },
  computed: {
    leaseGroup() {
      return this.leases.reduce((acc, lease) => {
        if (!acc[lease.scope]) {
          acc[lease.scope] = [];
        }
        acc[lease.scope].push(lease);
        return acc;
      }, {});
    },
  },
  methods: {
    fetchData(done) {
      api.get("listDhcpLeases").then((res) => {
        this.leases = res.leases;
        if (done) {
          done.detail();
        }
      });
    },
  },
};
</script>