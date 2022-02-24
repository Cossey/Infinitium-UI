<template>
  <f7-page name="cache" ptr @ptr:refresh="fetchData">
    <f7-navbar :title="$t('cache.title')">
      <template v-slot:left>
        <f7-link
          icon-ios="f7:menu"
          icon-aurora="material:menu"
          icon-md="material:menu"
          panel-open="left"
        />
      </template>
      <template v-slot:right>
        <f7-link
          v-if="domain != ''"
          icon-md="material:arrow_upward"
          icon-aurora="material:arrow_upward"
          :text="$theme.ios ? $t('cache.up') : ''"
          @click="up"
        />
      </template>
    </f7-navbar>
    <template v-if="records.length > 0">
      <f7-block-title>{{ $t('cache.records') }}</f7-block-title>
      <f7-list media-list>
        <template v-for="record in records" :key="record">
          <f7-list-item :title="record.name" :text="displayRData(record.rData, record.type)" :after="'TTL: ' + record.ttl">
            <template #media>{{ record.type }}</template>
          </f7-list-item>
        </template>
      </f7-list>
    </template>
    <template v-if="zones.length > 0">
      <f7-block-title>{{ $t('cache.zones') }}</f7-block-title>
      <f7-list>
        <template v-for="zone in zones" :key="zone">
          <f7-list-item :title="zone" link="#" @click="go(zone)" />
        </template>
      </f7-list>
    </template>
  </f7-page>
</template>

<script>
import { f7ready } from "framework7-vue";
import { ref } from '@vue/reactivity';
import RecordMixin from '@/components/record-mixin';


export default {
  mixins: [RecordMixin],
  data: () => ({
    zones: ref([]),
    domain: ref(''),
    records: ref([]),
  }),
  mounted() {
    f7ready((f7) => {
      this.fetchData();
    });
  },
  methods: {
    fetchData(done) {
      this.$api.get("listCachedZones", [["domain", this.domain]]).then(response => {
        this.zones = response.zones
        this.domain = response.domain
        this.records = response.records
      }).finally(() => {
        if (typeof done !== 'undefined') done();
      });
    },
    up() {
      var newDomain = this.domain;
      if ((newDomain != null) && (newDomain != "")) {

        var i = newDomain.indexOf(".");

        if (i == -1)
          newDomain = "";
        else
          newDomain = newDomain.substr(i + 1);
      }


      this.$api.get("listCachedZones", [["domain", newDomain], ["direction", "up"]]).then(response => {
        this.zones = response.zones
        this.domain = response.domain
        this.records = response.records
      }).finally(() => {
        if (typeof done !== 'undefined') done();
      });
    },
    go(domain) {
      console.log('go', domain)
      this.domain = domain;
      this.fetchData();
    }
  },
}
</script>