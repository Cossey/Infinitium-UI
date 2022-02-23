
export default {
  methods: {
    updateLocale (f7p) {
      f7p.params.smartSelect.pageBackLinkText = this.$t('dialogs.back');
      f7p.params.dialog.buttonOk = this.$t('dialogs.ok')
      f7p.params.dialog.buttonCancel = this.$t('dialogs.cancel')
      f7p.params.smartSelect.searchbarDisableText = this.$t('dialogs.cancel')
      f7p.params.smartSelect.searchbarPlaceholder = this.$t('dialogs.search')
      f7p.params.smartSelect.sheetCloseLinkText = this.$t('dialogs.done')
      f7p.params.smartSelect.popupCloseLinkText = this.$t('dialogs.close')
      f7p.params.smartSelect.pageBackLinkText = this.$t('dialogs.back')
      f7p.params.smartSelect.nothingFoundText = this.$t('dialogs.search.nothingFound')
    }
  }
}
