
import HomePage from '../pages/home.vue';
import AboutPage from '../pages/about.vue';
import ZonesPage from '../pages/zones.vue';
import ViewZonePage from '../pages/viewzone.vue';

import DhcpPage from '../pages/dhcp.vue';
import DhcpScopesPage from '../pages/dhcp-scopes.vue';
import DhcpLeasesPage from '../pages/dhcp-leases.vue';

import SettingsPage from '../pages/settings.vue';
import SettingsBackupPage from '../pages/settings-backup.vue';
import SettingsRestorePage from '../pages/settings-restore.vue';

import StatsPage from '../pages/stats.vue';

import DNSClientPage from '../pages/dnsclient.vue';
import DNSClientResultsPage from '../pages/dnsclient-results.vue';

import DynamicRoutePage from '../pages/dynamic-route.vue';
import RequestAndLoad from '../pages/request-and-load.vue';
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
            statsType: 'topClients'
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
    path: '/zones/',
    component: ZonesPage,
  },
  {
    path: '/client/',
    component: DNSClientPage
  },
  {
    path: '/client/results/',
    popup: {
      component: DNSClientResultsPage
    }
  },
  {
    path: '/zones/view/:zoneName/',
    component: ViewZonePage
  },
  {
    path: '/dynamic-route/blog/:blogId/post/:postId/',
    component: DynamicRoutePage,
  },
  {
    path: '/request-and-load/user/:userId/',
    async: function ({ router, to, resolve }) {
      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();

      // User ID from request
      var userId = to.params.userId;

      // Simulate Ajax Request
      setTimeout(function () {
        // We got user data from request
        var user = {
          firstName: 'Vladimir',
          lastName: 'Kharlampidi',
          about: 'Hello, i am creator of Framework7! Hope you like it!',
          links: [
            {
              title: 'Framework7 Website',
              url: 'http://framework7.io',
            },
            {
              title: 'Framework7 Forum',
              url: 'http://forum.framework7.io',
            },
          ]
        };
        // Hide Preloader
        app.preloader.hide();

        // Resolve route to load page
        resolve(
          {
            component: RequestAndLoad,
          },
          {
            props: {
              user: user,
            }
          }
        );
      }, 1000);
    },
  },
  {
    path: '(.*)',
    component: NotFoundPage,
  },
];

export default routes;
