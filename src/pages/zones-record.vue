<template>
  <f7-popup>
    <f7-view>
      <f7-page>
        <f7-navbar :title="(typeof this.inRecord === 'undefined' ? 'New' : 'Edit') + ' Record'">
          <template v-slot:left>
            <f7-link popup-close>Cancel</f7-link>
          </template>
          <template v-slot:right>
            <f7-link
              @click="updateRecord"
            >{{ (typeof this.inRecord === 'undefined' ? 'Create' : 'Save') }}</f7-link>
          </template>
        </f7-navbar>
        <f7-list>
          <f7-list-input label="Name" type="text" v-model:value="record.name" />
          <f7-list-item ref="typeSS" title="Type" smart-select :disabled="typeof this.inRecord !== 'undefined'">
            <select name="type" v-model="record.type">
              <option value="A" selected>A</option>
              <option value="AAAA">AAAA</option>
              <option value="NS">NS</option>
              <option value="PTR">PTR</option>
              <option value="MX">MX</option>
              <option value="TXT">TXT</option>
              <option value="SRV">SRV</option>
              <option value="ANAME">ANAME</option>
              <option value="CNAME">CNAME</option>
              <option value="DNAME">DNAME</option>
              <option value="CAA">CAA</option>
              <option value="APP">APP</option>
            </select>
          </f7-list-item>
          <f7-list-input label="TTL" type="number" placeholder="3600" v-model:value="record.ttl" />
        </f7-list>

        <f7-list v-show="record.type === 'A' || record.type === 'AAAA'">
          <f7-list-input
            :label="'IP' + (record.type === 'AAAA' ? 'v6' : 'v4') +' Address'"
            type="text"
            placeholder
            v-model:value="record.value"
            validate
            :required="record.type === 'A' || record.type === 'AAAA'"
            error-message="A valid IP Address is required."
            :pattern="regexIP(record.type)"
          />
          <f7-list-item
            checkbox
            title="Add reverse (PTR) record"
            name="ptr-record"
            v-model:checked="record.ptr"
          />
          <f7-list-item
            checkbox
            title="Create reverse zone for PTR record"
            name="reverse-zone"
            v-model:checked="record.createPtrZone"
            :disabled="record.ptr != true"
          />
        </f7-list>

        <f7-list v-show="record.type === 'NS'">
          <f7-list-input
            label="Name Server"
            type="text"
            placeholder
            v-model:value="record.value"
            :required="record.type === 'NS'"
            error-message="A valid Name Server is required."
          />
          <f7-list-input
            label="Glue Addresses"
            type="textarea"
            placeholder="192.168.1.1
2001:db8::"
            v-model:value="glue"
            resizable
          />
        </f7-list>

        <f7-list
          v-show="record.type === 'ANAME' || record.type === 'CNAME' || record.type === 'DNAME' || record.type === 'PTR'"
        >
          <f7-list-input
            label="Domain Name"
            type="text"
            placeholder
            v-model:value="record.value"
            :required="record.type === 'ANAME' || record.type === 'CNAME' || record.type === 'DNAME' || record.type === 'PTR'"
            error-message="A valid Domain Name is required."
          />
        </f7-list>

        <f7-list v-show="record.type === 'SRV'">
          <f7-list-input
            label="Priority"
            type="number"
            placeholder
            v-model:value="record.priority"
            :required="record.type === 'SRV'"
            error-message="A valid Priority is required."
          />
          <f7-list-input
            label="Weight"
            type="number"
            placeholder
            v-model:value="record.weight"
            :required="record.type === 'SRV'"
            error-message="A valid Weight is required."
          />
          <f7-list-input
            label="Port"
            type="number"
            placeholder
            v-model:value="record.port"
            :required="record.type === 'SRV'"
            error-message="A valid Port is required."
          />
          <f7-list-input
            label="Target"
            type="text"
            placeholder
            v-model:value="record.value"
            :required="record.type === 'SRV'"
            error-message="A valid Target is required."
          />
        </f7-list>

        <f7-list v-show="record.type === 'TXT'">
          <f7-list-input
            label="Text Data"
            type="text"
            :required="record.type === 'TXT'"
            v-model:value="record.value"
          />
        </f7-list>

        <f7-list v-show="record.type === 'MX'">
          <f7-list-input
            label="Preference"
            type="number"
            placeholder="1"
            v-model:value="record.priority"
          />
          <f7-list-input
            label="Exchange"
            type="text"
            placeholder
            v-model:value="record.value"
            :required="record.type === 'MX'"
            error-message="A valid Mail Exchange is required."
          />
        </f7-list>

        <f7-list v-show="record.type === 'CAA'">
          <f7-list-input
            label="Flags"
            type="number"
            placeholder="0"
            v-model:value="record.flags"
          />
          <f7-list-input
            label="Tag"
            type="text"
            placeholder="issue"
            v-model:value="record.tag"
          />
          <f7-list-input
            label="Auhority"
            type="text"
            placeholder
            v-model:value="record.value"
            :required="record.type === 'CAA'"
            error-message="A valid Auhority is required."
          />
        </f7-list>

        <f7-list>
          <f7-list-item
            checkbox
            title="Overwrite existing records"
            name="overwrite-existing"
            v-model:checked="record.overwrite"
          />
          <f7-list-input
            label="Comment"
            type="textarea"
            placeholder
            v-model:value="record.comment"
            resizable
          />
        </f7-list>
      </f7-page>
    </f7-view>
  </f7-popup>
</template>
<script>
import { f7, f7ready } from "framework7-vue";
import regex from "@/js/regex";

export default {
  mounted() {
    f7ready((f7) => {
      this.fetchData();
    });
  },
  data: () => ({
    record: {},
  }),
  props: {
    zoneName: Object,
    inRecord: Object,
    f7router: Object,
  },
  computed: {
    glue: {
      get() {
        return this.record.glue != null ? this.record.glue.join('\n') : "";
      },
      set(value) {
        this.record.glue = value.split('\n');
      },
    },
  },
  methods: {
    ...regex,
    fetchData() {
      if (this.inRecord) {
        this.record = this.inRecord;
      } else {
        this.record = {
          name: "",
          type: "A",
          ttl: 3600,
          overwrite: false,
          comment: "",
        };
      }

      this.$refs.typeSS.$el
        .querySelector(".smart-select")
        .f7SmartSelect.setValue(this.record.type);

    },
    updateRecord() {
      this.$emit('updateRecord', this.record);


    },
  },
}
</script>
