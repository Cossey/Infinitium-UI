<template>
  <f7-page name="settings" :page-content="false">
    <f7-navbar title="Settings">
      <template v-slot:right>
        <f7-link
          :icon-only="!$theme.ios"
          :text="$theme.ios ? 'Save' : ''"
          icon-md="material:check"
          icon-aurora="material:check"
          @click="saveData()"
        ></f7-link>
     </template>
    </f7-navbar>
    <f7-toolbar tabbar labels bottom>
      <f7-link
        tab-link="#server"
        tab-link-active
        text="Server"
        icon-ios="f7:device_desktop"
        icon-aurora="material:desktop_windows"
        icon-md="material:desktop_windows"
      ></f7-link>
      <f7-link
        tab-link="#dns"
        text="DNS"
        icon-ios="f7:cloud_upload"
        icon-aurora="material:dns"
        icon-md="material:dns"
      ></f7-link>
      <f7-link
        tab-link="#blocklist"
        text="Blocking"
        icon-ios="f7:xmark_shield"
        icon-aurora="material:gpp_bad"
        icon-md="material:gpp_bad"
      ></f7-link>
      <f7-link
        tab-link="#cache"
        text="Cache"
        icon-ios="f7:bolt_horizontal"
        icon-aurora="material:flash_on"
        icon-md="material:flash_on"
      ></f7-link>
      <f7-link
        tab-link="#network"
        text="Network"
        icon-ios="f7:globe"
        icon-aurora="material:language"
        icon-md="material:language"
      ></f7-link>
      <f7-link
        tab-link="#logging"
        text="Log"
        icon-ios="f7:doc_text"
        icon-aurora="material:description"
        icon-md="material:description"
      ></f7-link>
    </f7-toolbar>
    <f7-tabs>
      <f7-tab id="server" class="page-content validate-forms" tab-active>
        <f7-block-title>DNS Server</f7-block-title>
        <f7-list no-hairlines-md>
          <f7-list-input
            label="Server Domain"
            type="text"
            placeholder=""
            v-model:value="settings.dnsServerDomain"
          >
          </f7-list-input>
          <f7-list-input
            label="Local Endpoints"
            type="textarea"
            placeholder=""
            v-model:value="dnsServerLocalEndPoints"
            resizable
          >
          </f7-list-input>
          <f7-block-footer>
            <p>
              The DNS Server local end point changes will be automatically
              applied and so you do not need to manually restart the main
              service.
            </p>
          </f7-block-footer>
        </f7-list>

        <f7-list no-hairlines-md>
          <f7-list-input
            label="Default Record TTL"
            type="text"
            placeholder="3600"
            v-model:value="settings.defaultRecordTtl"
            required
            validate
            :pattern="regexNumber()"
            error-message="Enter a TTL value."
          >
          </f7-list-input>
          <f7-block-footer>
            <p>
              The default TTL value to use if not specified when adding or
              updating records in a Zone.
            </p>
          </f7-block-footer>
        </f7-list>

        <f7-list no-hairlines-md>
          <f7-list-item
            checkbox
            title="Prefer IPv6"
            v-model:checked="settings.preferIPv6"
          ></f7-list-item>
          <f7-block-footer>
            <p>
              Use this option only if this DNS server has native IPv6 Internet
              access otherwise it will affect performance.
            </p>
          </f7-block-footer>
        </f7-list>

        <f7-block-title>Web Service</f7-block-title>
        <f7-list no-hairlines-md>
          <f7-list-input
            label="Local Addresses"
            type="textarea"
            placeholder=""
            v-model:value="webServiceLocalAddresses"
            resizable
          >
          </f7-list-input>
          <f7-list-input
            label="HTTP Port"
            type="text"
            placeholder="5380"
            v-model:value="settings.webServiceHttpPort"
            required
            validate
            :pattern="regexNetworkPort()"
            error-message="Enter a port number between 1-65535."
          >
          </f7-list-input>
          <f7-list-item
            checkbox
            title="Enable HTTPS"
            name="https"
            v-model:checked="settings.webServiceEnableTls"
          ></f7-list-item>
          <f7-list-item
            checkbox
            title="HTTP to HTTPS Redirection"
            name="httpsredirection"
            v-model:checked="settings.webServiceHttpToTlsRedirect"
          ></f7-list-item>
          <f7-list-input
            label="HTTPS Port"
            type="text"
            placeholder="53443"
            v-model:value="settings.webServiceTlsPort"
            :required="settings.webServiceEnableTls === true"
            validate
            :disabled="settings.webServiceEnableTls === false"
            :pattern="regexNetworkPort()"
            error-message="Enter a port number between 1-65535."
          >
          </f7-list-input>

          <f7-list-input
            label="TLS Cert File Path"
            type="text"
            placeholder=""
            :disabled="settings.webServiceEnableTls === false"
            info="PKCS #12 cert (.pfx) file path on the server."
            v-model:value="settings.webServiceTlsCertificatePath"
          >
          </f7-list-input>
          <f7-list-input
            label="TLS Cert Password"
            type="text"
            placeholder=""
            :disabled="settings.webServiceEnableTls === false"
            info="Enter the cert (.pfx) password, if any."
            v-model:value="webServiceTlsCertificatePassword"
          >
          </f7-list-input>
          <f7-block-footer>
            <p>
              This web page will be automatically redirected to the new web
              console URL after saving settings. The HTTPS protocol will be
              enabled only when a TLS certificate is configured.
            </p>
          </f7-block-footer>
        </f7-list>

        <f7-block-title>Rate Limiting</f7-block-title>
        <div class="block">
          <p>
            Queries Per Minute (QPM) feature will limit requests from a client
            subnet based on its IP address and the specified subnet prefix
            lengths. The QPM limit configured will be compared with the average
            count from the sample size which means a client may exceed the QPM
            limit for a given minute but won't exceed for the given sample size
            in minutes.
          </p>
        </div>
        <f7-list no-hairlines-md>
          <f7-list-input
            label="Requests Limit"
            type="text"
            placeholder="0"
            :pattern="regexNumber()"
            v-model:value="settings.qpmLimitRequests"
            info="Maximum queries a client subnet can make per minute on average based on the sample size."
          >
          </f7-list-input>
          <f7-list-input
            label="Error Limit"
            type="text"
            placeholder="0"
            :pattern="regexNumber()"
            v-model:value="settings.qpmLimitErrors"
            info="Responses with RCODE as FormatError, ServerFailure, or Refused are considered as error responses."
          >
          </f7-list-input>
          <f7-list-input
            label="Sample Size"
            type="text"
            placeholder="5"
            :pattern="regexNumber()"
            v-model:value="settings.qpmLimitSampleMinutes"
            info="The sample size in minutes to be used for limiting queries per client."
          >
          </f7-list-input>
          <f7-list-input
            label="IPv4 Prefix Length"
            type="text"
            placeholder="24"
            :pattern="regexNumber()"
            v-model:value="settings.qpmLimitIPv4PrefixLength"
            info="The IPv4 prefix length to define the client subnet."
          >
          </f7-list-input>
          <f7-list-input
            label="IPv4 Prefix Length"
            type="text"
            placeholder="56"
            :pattern="regexNumber()"
            v-model:value="settings.qpmLimitIPv6PrefixLength"
            info="The IPv6 prefix length to define the client subnet."
          >
          </f7-list-input>
        </f7-list>
      </f7-tab>

      <f7-tab id="dns" class="page-content validate-forms">
        <f7-block-title>Optional DNS Protocols</f7-block-title>
        <div class="block">
          <p>
            These optional DNS server protocols are used to host these as a
            service. You do not need to enable these optional protocols to use
            them with Forwarders or Conditional Forwarder Zones.
          </p>
          <p>
            <a
              class="link external"
              href="https://blog.technitium.com/2020/07/how-to-host-your-own-dns-over-https-and.html"
              >Help: How To Host Your Own DNS-over-HTTPS And DNS-over-TLS
              Services</a
            >
          </p>
        </div>
        <f7-list no-hairlines-md>
          <f7-list-item
            checkbox
            title="Enable DNS-over-HTTP"
            after="TCP Port 8053"
            v-model:checked="settings.enableDnsOverHttp"
          ></f7-list-item>
          <f7-list-item
            checkbox
            title="Enable DNS-over-TLS"
            after="TCP Port 853"
            v-model:checked="settings.enableDnsOverTls"
          ></f7-list-item>
          <f7-list-item
            checkbox
            title="Enable DNS-over-HTTPS"
            after="TCP Port 80 & 443"
            v-model:checked="settings.enableDnsOverHttps"
          ></f7-list-item>
          <f7-list-input
            label="TLS Cert File Path"
            type="text"
            placeholder=""
            :disabled="
              settings.enableDnsOverTls === false &&
              settings.enableDnsOverHttps === false
            "
            v-model:value="settings.dnsTlsCertificatePath"
            info="Specify a PKCS #12 certificate (.pfx) file path on the server. The certificate must contain private key."
          >
          </f7-list-input>
          <f7-list-input
            label="TLS Cert Password"
            type="password"
            placeholder=""
            :disabled="
              settings.enableDnsOverTls === false &&
              settings.enableDnsOverHttps === false
            "
            v-model:value="dnsTlsCertificatePassword"
            info="Enter the certificate (.pfx) password, if any."
          >
          </f7-list-input>
          <f7-block-footer>
            <p>
              The DNS-over-TLS and DNS-over-HTTPS protocols will be enabled only
              when a TLS certificate is configured.
            </p>
            <p>
              For DNS-over-HTTP, use http://domain:8053/dns-query with a TLS
              terminating reverse proxy like nginx. For DNS-over-TLS, use
              tls-certificate-domain:853 and for DNS-over-HTTPS use
              https://tls-certificate-domain/dns-query to configure supported
              DNS clients.
            </p>
            <p>
              When using a reverse proxy with the DNS-over-HTTP service, you need to add X-Real-IP header to the proxy request with the IP address of the client to allow the DNS server to know the real IP address of the client originating the request. For example:
              <ul>
                <li>
                  nginx
                  <code>
                    proxy_set_header X-Real-IP $remote_addr;
                  </code>
                </li>
                <li>
                  HAProxy
                  <code>
                    http-request set-header X-Real-IP %[src]
                  </code>
                </li>
              </ul>
            </p>
          </f7-block-footer>
        </f7-list>

        <f7-block-title>Recursion</f7-block-title>

        <div class="block">
          <p>
            Disable recursion if you wish this server to act only as
            authoritative name server for the configured zones.
          </p>
        </div>

        <f7-list no-hairlines-md>
          <f7-list-item title="Recursion" ref="recursionSS" smart-select>
            <select name="Recursion" v-model="recursion">
              <option value="Deny">Deny Recursion</option>
              <option value="Allow">Allow Recursion</option>
              <option value="AllowOnlyForPrivateNetworks">
                Only For Private Networks (default)
              </option>
              <option value="UseSpecifiedNetworks">
                For Specified Networks
              </option>
            </select>
          </f7-list-item>
          <f7-list-input
            label="Allowed Networks (CIDR)"
            type="textarea"
            placeholder=""
            v-model:value="recursionAllowedNetworks"
            :disabled="settings.recursion !== 'UseSpecifiedNetworks'"
            resizable
          >
          </f7-list-input>
          <f7-list-input
            label="Denied Networks (CIDR)"
            type="textarea"
            placeholder=""
            v-model:value="recursionDeniedNetworks"
            :disabled="settings.recursion !== 'UseSpecifiedNetworks'"
            resizable
          >
          </f7-list-input>
        </f7-list>

        <f7-block-title>Recursive Resolver</f7-block-title>
        <f7-list no-hairlines-md>
          <f7-list-item
            checkbox
            title="Randomize Name"
            v-model:checked="settings.randomizeName"
          ></f7-list-item>
          <f7-block-footer>
            <p>
              Enables QNAME randomization when using UDP as the transport
              protocol to improve security.
            </p>
          </f7-block-footer>
        </f7-list>
        <f7-list no-hairlines-md>
          <f7-list-item
            checkbox
            title="QNAME Minimization"
            v-model:checked="settings.qnameMinimization"
          ></f7-list-item>
          <f7-block-footer>
            <p>
              Enables QNAME minimization for recursive resolution to improve
              privacy.
            </p>
          </f7-block-footer>
        </f7-list>

        <f7-list no-hairlines-md>
          <f7-list-item
            checkbox
            title="NS Revalidation"
            v-model:checked="settings.nsRevalidation"
          ></f7-list-item>
          <f7-block-footer>
            <p>Enables Delegation Revalidation for recursive resolution.</p>
          </f7-block-footer>
        </f7-list>
      </f7-tab>

      <f7-tab id="blocklist" class="page-content">
        <f7-block-title>Block List</f7-block-title>
        <div class="block">
          <p>
            DNS Server will use the data returned by the block list URLs to
            update the block list zone automatically. The expected file format
            is standard hosts file format or plain text file containing list of
            domains to block.
          </p>
          <p>
            <a
              class="link external"
              href="https://blog.technitium.com/2018/10/blocking-internet-ads-using-dns-sinkhole.html"
              >Help: Blocking Internet Ads Using DNS Sinkhole</a
            >
          </p>
        </div>
        <f7-list no-hairlines-md class="validate-forms">
          <f7-list-item
            checkbox
            title="Enable Blocking"
            v-model:checked="settings.enableBlocking"
          ></f7-list-item>
          <f7-list-item
            checkbox
            title="Allow TXT Blocking Report"
            v-model:checked="settings.allowTxtBlockingReport"
          ></f7-list-item>
          <f7-block-footer>
            <p>
              Specifies if the DNS Server should respond with TXT records
              containing a blocked domain report for TXT type requests.
            </p>
          </f7-block-footer>
        </f7-list>

        <f7-list no-hairlines-md class="validate-forms">
          <f7-list-item title="Blocking type" ref="blockingTypeSS" smart-select>
            <select name="BlockingType" v-model="blockingType">
              <option value="AnyAddress">Any Address</option>
              <option value="NxDomain">NX Domain</option>
              <option value="CustomAddress">Custom Address</option>
            </select>
          </f7-list-item>
          <f7-list-input
            label="Custom Blocking Addresses"
            type="textarea"
            placeholder=""
            v-model:value="customBlockingAddresses"
            :disabled="settings.blockingType !== 'CustomAddress'"
            resizable
          >
          </f7-list-input>
        </f7-list>

        <f7-list no-hairlines-md>
          <f7-list-input
            label="Block List URLS"
            type="textarea"
            placeholder=""
            v-model:value="blockListUrls"
            resizable
          >
          </f7-list-input>
          <f7-list-button
            title="Add From List"
            popup-open=".blocklists-selector"
          >
          </f7-list-button>
          <f7-block-footer>
            <p>
              Prefixing an <code>!</code> at the start of a URL to make it an
              allow list. Domain names in an allow list URL are prevented from
              being added to the block list zone.
            </p>
          </f7-block-footer>
        </f7-list>
        <f7-list no-hairlines-md class="validate-forms">
          <f7-list-input
            label="Update Interval"
            type="text"
            placeholder="24"
            v-model:value="settings.blockListUpdateIntervalHours"
            info="The interval in hours to automatically download and update the block lists."
          >
          </f7-list-input>
          <f7-list-item header="Next Update On" :title="blockListNextUpdatedOn">
          </f7-list-item>
          <f7-list-button
            @click="updateBlockLists()"
            title="Update Now"
          ></f7-list-button>
        </f7-list>

        <f7-block-title>Temporarily Disable</f7-block-title>
        <blocklists-temp-disable
          :disableBlockingTill="settings.temporaryDisableBlockingTill"
        ></blocklists-temp-disable>
      </f7-tab>

      <f7-tab id="cache" class="page-content validate-forms">
        <f7-block-title>Stale</f7-block-title>
        <div class="block">
          <p>
            Enable the Serve Stale feature to improve resiliency by using
            expired or stale records in cache when the DNS server is unable to
            reach the upstream or authoritative name servers.
          </p>
        </div>
        <f7-list no-hairlines-md>
          <f7-list-item
            checkbox
            title="Serve Stale"
            v-model:checked="settings.serveStale"
          ></f7-list-item>
          <f7-list-input
            label="Serve State TTL"
            type="text"
            placeholder="259200"
            v-model:value="settings.serveStaleTtl"
            info="recommended 259200 seconds i.e. 3 days"
            validate
            :disabled="settings.serveStale == false"
            :pattern="regexNumber()"
            error-message="Enter a number."
          >
          </f7-list-input>
          <f7-block-footer>
            <p>
              The TTL value in seconds which should be used for cached records
              that are expired. When the serve stale TTL too expires for a stale
              record, it gets removed from the cache. Recommended value is
              between 1-3 days and maximum supported value is 7 days.
            </p>
          </f7-block-footer>
        </f7-list>

        <f7-block-title>DNS Cache</f7-block-title>
        <f7-list no-hairlines-md>
          <f7-list-input
            label="Minimum TTL"
            type="text"
            placeholder="10"
            v-model:value="settings.cacheMinimumRecordTtl"
            validate
            :pattern="regexNumber()"
            error-message="Enter a number."
          >
          </f7-list-input>
          <f7-list-input
            label="Maximum TTL"
            type="text"
            placeholder="604800"
            v-model:value="settings.cacheMaximumRecordTtl"
            validate
            :pattern="regexNumber()"
            error-message="Enter a number."
          >
          </f7-list-input>
          <f7-list-input
            label="Negative TTL"
            type="text"
            placeholder="300"
            v-model:value="settings.cacheNegativeRecordTtl"
            validate
            :pattern="regexNumber()"
            error-message="Enter a number."
          >
          </f7-list-input>
          <f7-list-input
            label="Failure TTL"
            type="text"
            placeholder="60"
            v-model:value="settings.cacheFailureRecordTtl"
            validate
            :pattern="regexNumber()"
            error-message="Enter a number."
          >
          </f7-list-input>
        </f7-list>

        <flush-cache></flush-cache>

        <f7-block-title>Prefetcher</f7-block-title>
        <div class="block">
          <p>
            The DNS Server cache auto prefetch option can keep eligible domain
            names from last hour stats "hot" in cache. Auto prefetch eligibility
            value can be decided by keeping an eye on the hits shown for last
            hour on the dashboard. Experiment with auto prefetch sampling
            interval and eligibility to get best results.
          </p>
        </div>
        <f7-list no-hairlines-md>
          <f7-list-input
            label="Prefetch Eligibility"
            type="text"
            placeholder="2"
            v-model:value="settings.cachePrefetchEligibility"
            info="The minimum initial TTL value of a record needed to be eligible for prefetching."
            validate
            :pattern="regexNumber()"
            error-message="Enter a number."
          >
          </f7-list-input>
          <f7-list-input
            label="Prefetch Trigger"
            type="text"
            placeholder="9"
            v-model:value="settings.cachePrefetchTrigger"
            info="A record with TTL value less than trigger value will initiate prefetch operation immediately for itself. Set to 0 to disable prefetching and auto prefetching."
            validate
            :pattern="regexNumber()"
            error-message="Enter a number."
          >
          </f7-list-input>
          <f7-list-input
            label="Auto Prefetch Sampling"
            type="text"
            placeholder="5"
            v-model:value="settings.cachePrefetchSampleIntervalInMinutes"
            info="The interval to sample eligible domain names from last hour stats for auto prefetch."
            validate
            :pattern="regexNumber()"
            error-message="Enter a number."
          >
          </f7-list-input>
          <f7-list-input
            label="Auto Prefetch Eligibility"
            type="text"
            placeholder="30"
            v-model:value="settings.cachePrefetchSampleEligibilityHitsPerHour"
            info="Minimum required hits per hour for a domain name to be eligible for auto prefetch."
            validate
            :pattern="regexNumber()"
            error-message="Enter a number."
          >
          </f7-list-input>
        </f7-list>
      </f7-tab>

      <f7-tab id="network" class="page-content validate-forms">
        <f7-block-title>Proxy</f7-block-title>
        <div class="block">
          <p>
            When proxy server is configured, DNS Server will use it for all
            outbound network requests.
          </p>
        </div>
        <f7-list no-hairlines-md>
          <f7-list-item title="Type" ref="proxyTypeSS" smart-select>
            <select name="ProxyType" v-model="proxyType">
              <option value="None">None</option>
              <option value="Http">Http</option>
              <option value="Socks5">Socks 5</option>
            </select>
          </f7-list-item>
          <f7-list-input
            label="Proxy Address"
            type="text"
            placeholder=""
            v-model:value="proxyAddress"
            input-id="ProxyAddress"
            :disabled="proxyType === 'None'"
            validate
            :required="proxyType !== 'None'"
            error-message="A valid Hostname or IP Address is required."
            :pattern="regexHostnameOrIP()"
          >
          </f7-list-input>
          <f7-list-input
            label="Proxy Port"
            type="text"
            placeholder="8080"
            v-model:value="proxyPort"
            :disabled="proxyType === 'None'"
            validate
            :required="proxyType !== 'None'"
            error-message="Enter a port number between 1-65535."
            :pattern="regexNetworkPort()"
          >
          </f7-list-input>
          <f7-list-input
            label="Username"
            type="text"
            placeholder=""
            :disabled="proxyType === 'None'"
            v-model:value="proxyUsername"
          >
          </f7-list-input>
          <f7-list-input
            label="Password"
            type="password"
            placeholder=""
            :disabled="proxyType === 'None'"
            v-model:value="proxyPassword"
          >
          </f7-list-input>
          <f7-list-input
            label="Proxy Bypass List"
            type="textarea"
            placeholder=""
            :disabled="proxyType === 'None'"
            info="Enter IP addresses, network addresses or domain names to next proxy."
            resizable
            v-model:value="proxyBypass"
          >
          </f7-list-input>
        </f7-list>

        <f7-block-title>Forwarding</f7-block-title>
        <div class="block">
          <p>
            Forwarders are DNS servers which this DNS Server should use to
            resolve recursive queries. If no forwarders are configured then this
            DNS server will use preconfigured ROOT SERVERS to perform recursive
            resolution.
          </p>
          <p>
            <a
              class="link external"
              href="https://blog.technitium.com/2018/06/configuring-dns-server-for-privacy.html"
              >Help: Configuring DNS Server For Privacy &amp; Security</a
            >
          </p>
        </div>
        <f7-list no-hairlines-md>
          <f7-list-input
            label="Forwarders"
            type="textarea"
            placeholder=""
            v-model:value="forwarders"
            resizable
          >
          </f7-list-input>
          <f7-list-item ref="forwarderProtocolSS" title="Protocol" smart-select>
            <select name="Protocol" v-model="forwarderProtocol">
              <option value="Udp">DNS-over-UDP</option>
              <option value="Tcp">DNS-over-TCP</option>
              <option value="Tls">DNS-over-TLS</option>
              <option value="Https">DNS-over-HTTPS</option>
              <option value="HttpsJson">DNS-over-HTTPS (JSON)</option>
            </select>
          </f7-list-item>
          <f7-list-button
            popup-open=".forwarders-selector"
            title="Select Forwarders"
          ></f7-list-button>
        </f7-list>
      </f7-tab>

      <f7-tab id="logging" class="page-content validate-forms">
        <f7-block-title>Logging</f7-block-title>
        <f7-list no-hairlines-md>
          <f7-list-item
            checkbox
            title="Enable Logging"
            name="enablelogging"
            v-model:checked="settings.enableLogging"
          ></f7-list-item>
          <f7-list-item
            checkbox
            title="Use Local Time"
            name="localtime"
            :disabled="settings.enableLogging == false"
            v-model:checked="settings.useLocalTime"
          ></f7-list-item>
          <f7-list-item
            checkbox
            title="Log All Queries"
            name="logallqueries"
            :disabled="settings.enableLogging == false"
            v-model:checked="settings.logQueries"
          ></f7-list-item>
          <f7-block-footer>
            <p>
              Log every query received by this DNS Server and the corresponding
              response. Enabling query logging will significantly increase the
              log file size and use up disk space.
            </p>
          </f7-block-footer>
        </f7-list>

        <f7-list no-hairlines-md>
          <f7-list-input
            label="Log Folder Path"
            type="text"
            placeholder=""
            :disabled="settings.enableLogging == false"
            info="Folder path on the server where the log files should be saved."
            v-model:value="settings.logFolder"
            :required="settings.enableLogging === true"
            error-message="A folder path is required."
          >
          </f7-list-input>
          <f7-list-input
            label="Max Log File Days"
            type="text"
            placeholder=""
            info="Set 0 to disable auto delete. Max number of days to keep the log files."
            v-model:value="settings.maxLogFileDays"
            validate
            :required="settings.enableLogging === true"
            :pattern="regexNumber()"
            error-message="Enter a valid number."
          >
          </f7-list-input>
          <f7-list-input
            label="Max Stat File Days"
            type="text"
            placeholder=""
            info="Set 0 to disable auto delete. Max number of days to keep the dashboard stats."
            v-model:value="settings.maxStatFileDays"
            validate
            :required="settings.enableLogging === true"
            :pattern="regexNumber()"
            error-message="Enter a valid number."
          >
          </f7-list-input>
        </f7-list>
      </f7-tab>
    </f7-tabs>

    <blocklists-selector @selected="addToBlockList"></blocklists-selector>
    <forwarders-selector
      @selected="addToForwarders"
      :protocol="settings.forwarderProtocol"
    ></forwarders-selector>
  </f7-page>
</template>
<script>
import { f7, f7ready } from "framework7-vue";
import { ref } from "vue";
import regex from "@/js/regex";
import BlocklistsSelector from "@/components/blocklists-selector.vue";
import ForwardersSelector from "@/components/forwarders-selector.vue";
import BlocklistsTempDisable from "@/components/blocklists-temp-disable.vue";
import FlushCache from "@/components/flush-cache.vue";

var saveToastItem;
const savedToast = () => {
  if (!saveToastItem) {
    saveToastItem = f7.toast.create({
      text: "Saved Settings",
      horizontalPosition: "center",
      closeTimeout: 3000,
    });
  }
  saveToastItem.open();
};
export default {
  components: {
    BlocklistsSelector,
    ForwardersSelector,
    BlocklistsTempDisable,
    FlushCache,
  },
  setup() {
    const settings = ref({});
    const temporaryDisableBlockMins = ref();
    return {
      settings,
      temporaryDisableBlockMins,
    };
  },
  mounted() {
    f7ready((f7) => {
      this.fetchData();
    });
  },
  computed: {
    blockListNextUpdatedOn: {
      get() {
        var dateRaw = this.settings.blockListNextUpdatedOn;
        if (!dateRaw) {
          return "";
        } else {
          var date = new Date(dateRaw);
          return date.toLocaleDateString() + " " + date.toLocaleTimeString();
        }
      },
      set(value) {},
    },
    blockListUrls: {
      get() {
        return this.settings.blockListUrls != null
          ? this.settings.blockListUrls.join("\n")
          : "";
      },
      set(val) {
        this.settings.blockListUrls = val.split("\n");
      },
    },
    forwarderProtocol: {
      get() {
        return this.settings.forwarderProtocol;
      },
      set(val) {
        this.settings.forwarderProtocol = val;
      },
    },
    customBlockingAddresses: {
      get() {
        return this.settings.customBlockingAddresses != null
          ? this.settings.customBlockingAddresses.join("\n")
          : "";
      },
      set(val) {
        this.settings.customBlockingAddresses = val.split("\n");
      },
    },
    blockingType: {
      get() {
        return this.settings.blockingType;
      },
      set(val) {
        this.settings.blockingType = val;
      },
    },
    recursion: {
      get() {
        return this.settings.recursion;
      },
      set(val) {
        this.settings.recursion = val;
      },
    },
    proxyType: {
      get() {
        if (
          this.settings.proxy != null &&
          typeof this.settings.proxy.type !== "undefined"
        ) {
          return this.settings.proxy.type;
        } else {
          return "None";
        }
      },
      set(val) {
        if (this.settings.proxy == null) {
          this.settings.proxy = {};
        }
        this.settings.proxy["type"] = val;
      },
    },
    proxyAddress: {
      get() {
        if (this.settings.proxy != null) {
          return this.settings.proxy.address;
        } else {
          return "";
        }
      },
      set(val) {
        if (this.settings.proxy == null) {
          this.settings.proxy = {};
        }
        this.settings.proxy["address"] = val;
      },
    },
    proxyPort: {
      get() {
        if (this.settings.proxy != null) {
          return this.settings.proxy.port;
        } else {
          return "";
        }
      },
      set(val) {
        if (this.settings.proxy == null) {
          this.settings.proxy = {};
        }
        this.settings.proxy["port"] = val;
      },
    },
    proxyUsername: {
      get() {
        if (this.settings.proxy != null) {
          return this.settings.proxy.username;
        } else {
          return "";
        }
      },
      set(val) {
        if (this.settings.proxy == null) {
          this.settings.proxy = {};
        }
        this.settings.proxy["username"] = val;
      },
    },
    proxyPassword: {
      get() {
        if (this.settings.proxy != null) {
          return this.settings.proxy.password;
        } else {
          return "";
        }
      },
      set(val) {
        if (this.settings.proxy == null) {
          this.settings.proxy = {};
        }
        this.settings.proxy["password"] = val;
      },
    },
    proxyBypass: {
      get() {
        if (this.settings.proxy != null) {
          return typeof this.settings.proxy.bypass === "undefined"
            ? ""
            : this.settings.proxy.bypass.join("\n");
        } else {
          return "";
        }
      },
      set(val) {
        if (this.settings.proxy == null) {
          this.settings.proxy = {};
        }
        this.settings.proxy["bypass"] = val.split("\n");
      },
    },
    recursionAllowedNetworks: {
      get() {
        return typeof this.settings.recursionAllowedNetworks !== "undefined"
          ? this.settings.recursionAllowedNetworks.join("\n")
          : "";
      },
      set(val) {
        this.settings.recursionAllowedNetworks = val.split("\n");
      },
    },
    recursionDeniedNetworks: {
      get() {
        return typeof this.settings.recursionDeniedNetworks !== "undefined"
          ? this.settings.recursionDeniedNetworks.join("\n")
          : "";
      },
      set(val) {
        this.settings.recursionDeniedNetworks = val.split("\n");
      },
    },
    dnsServerLocalEndPoints: {
      get() {
        return typeof this.settings.dnsServerLocalEndPoints !== "undefined"
          ? this.settings.dnsServerLocalEndPoints.join("\n")
          : "";
      },
      set(val) {
        this.settings.dnsServerLocalEndPoints = val.split("\n");
      },
    },
    webServiceLocalAddresses: {
      get() {
        return typeof this.settings.webServiceLocalAddresses !== "undefined"
          ? this.settings.webServiceLocalAddresses.join("\n")
          : "";
      },
      set(val) {
        this.settings.webServiceLocalAddresses = val.split("\n");
      },
    },
    forwarders: {
      get() {
        return this.settings.forwarders != null
          ? this.settings.forwarders.join("\n")
          : "";
      },
      set(val) {
        this.settings.forwarders = val.split("\n");
      },
    },
    webServiceTlsCertificatePassword: {
      get() {
        return "";
      },
      set(val) {
        this.settings.webServiceTlsCertificatePassword = val;
      },
    },
    dnsTlsCertificatePassword: {
      get() {
        return "";
      },
      set(val) {
        this.settings.dnsTlsCertificatePassword = val;
      },
    },
  },
  methods: {
    ...regex,
    addToForwarders: function (servers) {
      var serverList = servers.join(",");
      serverList = serverList.replace(/,/g, "\n");
      this.forwarders = serverList;
    },
    addToBlockList: function (urls) {
      var list = this.settings.blockListUrls;

      if (list == null) {
        list = [];
      }

      for (var i = 0; i < urls.length; i++) {
        if (list.indexOf(urls[i]) === -1) {
          list.push(urls[i]);
        }
      }
      this.settings.blockListUrls = list;
    },
    updateBlockLists: function () {
      this.$api.get("forceUpdateBlockLists").then((res) => {
        f7.dialog.alert("Block Lists Updated");
      });
    },
    saveData: function () {
      if (f7.input.validateInputs(".validate-forms")) {
        this.$api
          .get(
            "setDnsSettings",
            this.$api.serializeParams(this.settings, [
              "version",
              "blockListNextUpdatedOn",
            ])
          )
          .then((res) => {
            savedToast();
            this.fetchData();
          });
      } else {
        f7.dialog.alert(
          "Could not save settings. Please check the settings for any missing or incorrect values."
        );
      }
    },
    fetchData: function (done) {
      this.$api.get("getDnsSettings").then((data) => {
        this.settings = data;

        f7.store.dispatch('domain', data.dnsServerDomain);

        this.$refs.proxyTypeSS.$el
          .querySelector(".smart-select")
          .f7SmartSelect.setValue(this.proxyType);
        this.$refs.forwarderProtocolSS.$el
          .querySelector(".smart-select")
          .f7SmartSelect.setValue(this.forwarderProtocol);

        this.$refs.blockingTypeSS.$el
          .querySelector(".smart-select")
          .f7SmartSelect.setValue(this.blockingType);

        this.$refs.recursionSS.$el
          .querySelector(".smart-select")
          .f7SmartSelect.setValue(this.recursion);
      });
    },
  },
};
</script>