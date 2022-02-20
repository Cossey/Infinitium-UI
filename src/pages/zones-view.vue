<template>
  <f7-page name="zones" ptr @ptr:refresh="fetchData">
    <f7-navbar title="View Zone" back-link="Zones">
      <template v-slot:right>
        <f7-link
          v-if="zone.type !== 'Stub'"
          icon-md="material:done_all"
          icon-aurora="material:done_all"
          @click="selectToggle"
          :text="($theme.ios) ? ((selectActive) ? 'Done' : 'Select') : ''"
        />
      </template>
    </f7-navbar>

    <f7-block v-if="!loading">
      <p>
        {{ zone.name }}
        <f7-badge :color="zone.internal ? 'gray' : 'blue'">{{ recordType(zone) }}</f7-badge>
        <f7-badge
          class="badge-padding"
          :color="zone.disabled ? 'red' : (zone.isExpiry ? 'red' : 'green')"
        >{{ zone.disabled ? "Disabled" : (zone.isExpiry ? "Expired" : "Enabled") }}</f7-badge>
        <span v-if="zone.expiry" class="expiry-text">Expiry: {{ dateFormat(zone.expiry) }}</span>
      </p>
    </f7-block>
    <f7-block v-if="loading">
      <p>Loading</p>
    </f7-block>

    <f7-block v-if="!zone.internal && !loading" :class="(selectActive ? 'disabled' : '')">
      <f7-row>
        <f7-col v-if="zone.type === 'Primary' || zone.type === 'Forwarder'">
          <f7-button color="blue" @click="recordAdd">Add Record</f7-button>
        </f7-col>
        <f7-col>
          <f7-button color="orange" @click="zoneDisable" v-if="!zone.disabled">Disable Zone</f7-button>
          <f7-button color="orange" @click="zoneEnable" v-if="zone.disabled">Enable Zone</f7-button>
        </f7-col>
        <f7-col>
          <f7-button color="red" @click="zoneDelete">Delete Zone</f7-button>
        </f7-col>
        <f7-col v-if="zone.type === 'Stub' || zone.type === 'Secondary'">
          <f7-button color="blue" @click="zoneResync">Resync</f7-button>
        </f7-col>
        <f7-col v-if="zone.type === 'Primary' || zone.type === 'Secondary'">
          <f7-button color="blue" @click="zoneOptions">Options</f7-button>
        </f7-col>
      </f7-row>
    </f7-block>

    <f7-toolbar bottom v-if="selectActive">
      <f7-link
        icon-aurora="material:delete"
        icon-md="material:delete"
        text="Delete"
        @click="deleteSelected"
      />
      <f7-link
        icon-aurora="material:done"
        icon-md="material:done"
        text="Enable"
        @click="edSelected('false')"
      />
      <f7-link
        icon-aurora="material:close"
        icon-md="material:close"
        text="Disable"
        @click="edSelected('true')"
      />
    </f7-toolbar>

    <template v-if="loading">
      <f7-list media-list>
        <f7-list-item
          v-for="n in 3"
          :key="n"
          class="skeleton-text skeleton-effect-wave"
          header="___"
          title="________________"
          after="___ ___"
          text="________________________________"
        ></f7-list-item>
      </f7-list>
    </template>
    <template v-else>
      <f7-list media-list v-if="!loading">
        <template v-for="record in recordList" v-bind:key="record">
          <f7-list-item
            swipeout
            @swipeout:deleted="removeRecord(record)"
            @click="(e) => recordClick(e, record)"
            :header="record.type"
            :title="record.name"
            :checkbox="selectActive && canDisableDelete(record)"
            :checked="selectItemSelected(record.type + record.name)"
            :after="'TTL: ' + record.ttl"
            :text="convertData(record.rData)"
            :footer="recordDisabled(record.disabled)"
            :no-chevron="selectActive"
          >
            <f7-swipeout-actions v-if="canDisableDelete(record)" right>
              <f7-swipeout-button
                delete
                confirm-text="Are you sure you want to delete this record?"
              >Delete</f7-swipeout-button>
            </f7-swipeout-actions>
            <f7-swipeout-actions v-if="canDisableDelete(record)" left>
              <f7-swipeout-button
                v-if="record.disabled"
                color="green"
                @click="enableRecord(record)"
              >Enable</f7-swipeout-button>
              <f7-swipeout-button
                v-if="!record.disabled"
                color="orange"
                @click="disableRecord(record)"
              >Disable</f7-swipeout-button>
            </f7-swipeout-actions>
          </f7-list-item>
        </template>
      </f7-list>
      <f7-block-footer class="text-align-center">
        <p>{{ $t('misc.records', { n: recordList.length }) }}</p>
      </f7-block-footer>
    </template>
  </f7-page>
</template>
<style lang="less" scoped>
.badge-padding {
  margin-left: 5px;
  margin-right: 5px;
}
.expiry-text {
  font-size: 0.8em;
}
</style>
<script>
import { f7, f7ready } from "framework7-vue";
import { ref } from "vue";
import SelectMixin from "@/components/select-mixin";

export default {
  mixins: [SelectMixin],
  data() {
    return {
      recordList: [],
      zone: {},
      loading: ref(true)
    }
  },
  props: {
    zoneName: Object,
    f7router: Object,
  },
  mounted() {
    f7ready((f7) => {
      this.fetchData();
    });
  },
  methods: {
    recordClick(event, record) {
      if (this.selectActive) {
        this.selectItemToggle(record);
      } else {
        //this.f7router.navigate(`/records/${this.zoneName}/${record.type}/${record.name}`);
      }
    },
    dateFormat(date) {
      if (!date) return null;
      return new Date(date).toLocaleString();
    },
    deleteSelected() {
      function buildParams(record) {
        return [
          ["domain", record.name],
          ["type", record.type],
          ["value", record.rData.value],
        ];
      }

      this.$api.doBatchGet((r) => "deleteRecord", buildParams, this.selectItems).then((res) => {
        this.fetchData();
        this.selectClear();
      });
    },
    edSelected(disable) {
      function buildParams(record) {
        return [
          ["type", record.type],
          ["domain", record.name],
          ["disable", disable],
          ["value", record.rData.value],
          ["ttl", record.ttl],
        ];
      }

      this.$api.doBatchGet((r) => "updateRecord", buildParams, this.selectItems).then((res) => {
        this.fetchData();
        this.selectClear();
      });
    },
    zoneOptions() {
      this.f7router.navigate("/zones/" + this.zone.name + "/options/");
    },
    recordAdd() {
      this.f7router.navigate("/zones/" + this.zone.name + "/record/");
    },
    zoneResync() {
      f7.dialog.confirm("Are you sure you want to resync this zone?", () => {
        this.$api.get("zone/resync", [
          ["domain", this.zone.name]
        ]).then((res) => {
          this.fetchData();
        });
      });
    },
    zoneDelete() {
      f7.dialog.confirm(
        'Are you sure you want to delete this zone?',
        () => {
          this.$api.get("deleteZone", [
            ["domain", this.zone.name]
          ]).then((res) => {
            f7.emit("zoneDeleted", this.zone.name);
            this.f7router.back();
          })
        });
    },
    zoneDisable() {
      f7.dialog.confirm(
        'Are you sure you want to disable this zone?',
        () => {
          this.$api.get("disableZone", [
            ["domain", this.zone.name]
          ]).then((res) => {
            f7.emit("zoneDisabled", this.zone.name);
            this.fetchData();
          })
        }
      );
    },
    zoneEnable() {
      f7.dialog.confirm(
        'Are you sure you want to enable this zone?',
        () => {
          this.$api.get("enableZone", [
            ["domain", this.zone.name]
          ]).then((res) => {
            f7.emit("zoneEnabled", this.zone.name);
            this.fetchData();
          })
        }
      );
    },
    canDisableDelete: function (record) {
      return record.type !== "SOA" && this.zone.internal !== true && this.zone.type !== 'Stub';
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
        keyvaluepair += `${property}: ${rData[property]};\n`;
      }
      return keyvaluepair;
    },
    disableRecord: function (record) {
      this.$api
        .get("updateRecord", [
          ["type", record.type],
          ["domain", record.name],
          ["disable", "true"],
          ["value", record.rData.value],
          ["ttl", record.ttl],
        ])
        .then((res) => {
          this.fetchData();
        });
    },
    enableRecord: function (record) {
      this.$api
        .get("updateRecord", [
          ["type", record.type],
          ["domain", record.name],
          ["disable", "false"],
          ["value", record.rData.value],
          ["ttl", record.ttl],
        ])
        .then((res) => {
          this.fetchData();
        });
    },
    removeRecord: function (record) {
      this.$api
        .get("deleteRecord", [
          ["domain", record.name],
          ["type", record.type],
          ["value", record.rData.value],
          ["ttl", record.ttl],
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
    newRecord: function () { },
    fetchData: function (done) {
      this.$api.get("getRecords", [["domain", this.zoneName]]).then((data) => {
        this.recordList = data.records;
        this.zone = data.zone;
        this.loading = false;
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

