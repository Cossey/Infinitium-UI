<template>
  <f7-page name="zones" ptr @ptr:refresh="fetchData">
    <f7-navbar title="View Zone" back-link="Zones">
      <f7-nav-right v-if="ios()">
        <f7-link icon-only icon-f7="plus" @click="newRecord()"></f7-link>
      </f7-nav-right>
    </f7-navbar>
    <template #fixed v-if="!ios()">
      <f7-fab
        position="center-bottom"
        text="New"
        color="red"
        @click="newRecord()"
      >
        <f7-icon ios="f7:plus" aurora="f7:plus" md="material:add"></f7-icon>
      </f7-fab>
    </template>

    <f7-block-title>{{ zone.name }}</f7-block-title>
    <f7-block>
      <p>{{ recordType(zone) }}</p>
      <f7-block-footer v-if="zone.disabled">Disabled</f7-block-footer>
    </f7-block>

    <f7-list media-list>
      <template v-for="record in recordList" v-bind:key="record">
        <f7-list-item
          swipeout
          @swipeout:deleted="removeRecord(record)"
          link="#"
          :header="record.type"
          :title="record.name"
          :after="'TTL: ' + record.ttl"
          :text="convertData(record.rData)"
          :footer="recordDisabled(record.disabled)"
        >
          <f7-swipeout-actions v-if="canDisableDelete(record)" right>
            <f7-swipeout-button
              delete
              confirm-text="Are you sure you want to delete this record?"
            >
              Delete
            </f7-swipeout-button>
          </f7-swipeout-actions>
          <f7-swipeout-actions v-if="canDisableDelete(record)" left>
            <f7-swipeout-button
              v-if="record.disabled"
              color="green"
              @click="enableRecord(record)"
            >
              Enable
            </f7-swipeout-button>
            <f7-swipeout-button
              v-if="!record.disabled"
              color="orange"
              @click="disableRecord(record)"
            >
              Disable
            </f7-swipeout-button>
          </f7-swipeout-actions>
        </f7-list-item>
      </template>
    </f7-list>
    <f7-block-footer class="text-align-center">
      <p>{{ recordList.length }} items</p>
    </f7-block-footer>
  </f7-page>
</template>
<script>
import api from "../js/api";
import { f7, f7ready, theme } from "framework7-vue";
import { ref } from "vue";

export default {
  setup() {
    const recordList = ref([]);
    const zone = ref({});

    return {
      recordList,
      zone,
    };
  },
  props: {
    zoneName: Object,
  },
  mounted() {
    f7ready((f7) => {
      this.fetchData();
    });
  },
  methods: {
    canDisableDelete: function (record) {
      return record.type !== "SOA" && this.zone.internal !== true;
    },
    ios: function () {
      return theme.ios;
    },
    recordType: function (record) {
      if (record.internal) {
        return "Internal";
      } else {
        return record.type;
      }
    },
    convertData: function (rData) {
      var keyvaluepair = "";
      for (const property in rData) {
        keyvaluepair += `${property}: ${rData[property]}; `;
      }
      return keyvaluepair;
    },
    disableRecord: function (record) {
      api
        .get("updateRecord", [
          ["type", record.type],
          ["domain", record.name],
          ["disable", "true"],
          ["value", record.rData.value],
        ])
        .then((res) => {
          this.fetchData();
        });
    },
    enableRecord: function (record) {
      api
        .get("updateRecord", [
          ["type", record.type],
          ["domain", record.name],
          ["disable", "false"],
          ["value", record.rData.value],
        ])
        .then((res) => {
          this.fetchData();
        });
    },
    removeRecord: function (record) {
      api
        .get("deleteRecord", [
          ["domain", record.name],
          ["type", record.type],
          ["value", record.rData.value],
        ])
        .then((data) => {
          const itemToRemoveIndex = array.findIndex(function (item) {
            return (
              item["domain"] === record.name &&
              item["type"] === record.type &&
              item["value"] === record.rData.value
            );
          });
          // proceed to remove an item only if it exists.
          if (itemToRemoveIndex !== -1) {
            array.splice(itemToRemoveIndex, 1);
          }
        });
    },
    newRecord: function () {},
    fetchData: function (done) {
      api.get("getRecords", [["domain", this.zoneName]]).then((data) => {
        this.recordList = data.records;
        this.zone = data.zone;

        if (typeof done !== "undefined") done();
      });
    },
    recordDisabled: function (zoneDisabled) {
      if (zoneDisabled) {
        return "Disabled";
      }
    },
  },
};
</script>

