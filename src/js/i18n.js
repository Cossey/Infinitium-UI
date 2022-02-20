import {createI18n} from 'vue-i18n';

export function loadLocaleMessages (locales) {
  const messages = {}
  locales.keys().forEach(key => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i)
    if (matched && matched.length > 1) {
      console.debug('loading i18n messages from: ' + key)
      const locale = matched[1]
      messages[locale] = locales(key)
    }
  })
  return messages
}

export const i18n = createI18n({
  locale: process.env.I18N_LOCALE || navigator.language || navigator.userLanguage || 'en',
  fallbackLocale: 'en',
  messages: loadLocaleMessages(require.context('@/assets/i18n'))
})

export default {
  install (app) {
    app.use(i18n)
  }
}