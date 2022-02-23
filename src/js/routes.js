
import HomePage from '../pages/home.vue';
import AboutPage from '../pages/about.vue';

import ZonesPage from '../pages/zones.vue';
import ZonesNewPage from '../pages/zones-new.vue';
import ZonesViewPage from '../pages/zones-view.vue';
import ZonesOptionsPage from '../pages/zones-options.vue';
import ZonesRecordPage from '../pages/zones-record.vue';

import DhcpPage from '../pages/dhcp.vue';
import DhcpScopesPage from '../pages/dhcp-scopes.vue';
import DhcpLeasesPage from '../pages/dhcp-leases.vue';

import AppsPage from '../pages/apps.vue';
import AppsConfigPage from '../pages/apps-installed-config.vue';
import AppsInstalledPage from '../pages/apps-installed.vue';
import AppsStorePage from '../pages/apps-store.vue';

import SettingsPage from '../pages/settings.vue';
import SettingsBackupPage from '../pages/settings-backup.vue';
import SettingsRestorePage from '../pages/settings-restore.vue';
import SettingsTsigPage from '../pages/settings-tsig.vue';

import StatsPage from '../pages/stats.vue';

import DNSClientPage from '../pages/dnsclient.vue';
import DNSClientResultsPage from '../pages/dnsclient-results.vue';

import NotFoundPage from '../pages/404.vue';

import ToolsPage from '../pages/tools.vue';
import UserPage from '../pages/user.vue';

import LogsPage from '../pages/logs.vue';
import LogPage from '../pages/log.vue';

var routes = [
  {
    path: '/',
    component: HomePage,
    keepAlive: true
  },
  {
    path: '/tools/',
    component: ToolsPage,
  },
  {
    path: '/about/',
    component: AboutPage,
  },
  {
    path: '/settings/',
    component: SettingsPage,
    routes: [
      {
        path: 'backup/',
        component: SettingsBackupPage,
      },
      {
        path: 'restore/',
        component: SettingsRestorePage,
      },
      {
        path: 'tsig/',
        popup: {
          component: SettingsTsigPage,
        },
      }
    ]
  },
  {
    path: '/user/',
    component: UserPage,
  },
  {
    path: '/logs/',
    component: LogsPage,
    master: true,
    detailRoutes: [
      {
        path: '/logs/file/:file/',
        component: LogPage,
      }
    ]
  },
  {
    path: '/stats/',
    routes: [
      {
        path: 'clients/',
        component: StatsPage,
        options: {
          props: {
            statsType: 'topClients'
          }
        }
      },
      {
        path: 'clients/:type/',
        component: StatsPage,
        options: {
          props: {
            statsType: 'topClients',
          }
        }
      },
      {
        path: 'clients/custom/:start/:end/',
        component: StatsPage,
        options: {
          props: {
            statsType: 'topClients',
            type: 'custom',
          }
        }
      },
      {
        path: 'domains/',
        component: StatsPage,
        options: {
          props: {
            statsType: 'topDomains'
          }
        },
      },
      {
        path: 'domains/:type/',
        component: StatsPage,
        options: {
          props: {
            statsType: 'topDomains'
          }
        },
      },
      {
        path: 'domains/custom/:start/:end/',
        component: StatsPage,
        options: {
          props: {
            statsType: 'topDomains',
            type: 'custom',
          }
        },
      },
      {
        path: 'blocked/',
        component: StatsPage,
        options: {
          props: {
            statsType: 'topBlockedDomains'
          }
        }
      },
      {
        path: 'blocked/:type/',
        component: StatsPage,
        options: {
          props: {
            statsType: 'topBlockedDomains'
          }
        }
      },
      {
        path: 'blocked/custom/:start/:end/',
        component: StatsPage,
        options: {
          props: {
            statsType: 'topBlockedDomains',
            type: 'custom',
          }
        }
      },
    ]
  },
  {
    path: '/dhcp/',
    component: DhcpPage,
    tabs: [
      {
        path: '/',
        id: 'leases',
        component: DhcpLeasesPage,
      },
      {
        path: '/scopes/',
        id: 'scopes',
        component: DhcpScopesPage,
      }
    ]
  },
  {
    path: '/apps/',
    component: AppsPage,
    tabs: [
      {
        path: '/',
        id: 'installed',
        component: AppsInstalledPage,
      },
      {
        path: '/store/',
        id: 'store',
        component: AppsStorePage,
      }
    ],
    routes: [
      {
        path: ':appName/config',
        popup: {
          component: AppsConfigPage,
        }
      }
    ]
  },
  {
    path: '/zones/',
    component: ZonesPage,
    routes: [
      {
        path: 'new/',
        popup: {
          component: ZonesNewPage,
        }
      },
      {
        path: ':zoneName/',
        routes: [
          {
            path: 'view/',
            component: ZonesViewPage,
          },
          {
            path: 'options/',
            popup: {
              component: ZonesOptionsPage,
            }
          },
          {
            path: 'record/',
            popup: {
              component: ZonesRecordPage,
            }
          }
        ]
      },
    ]
  },
  {
    path: '/client/',
    component: DNSClientPage,
    routes: [
      {
        path: 'results/',
        popup: {
          component: DNSClientResultsPage,
        }
      }
    ]
  },
  {
    path: '(.*)',
    component: NotFoundPage,
  },
];

export default routes;
