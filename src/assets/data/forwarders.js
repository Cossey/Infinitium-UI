export const forwarders = [
    {
        "name": "Cloudflare",
        "type": "udp",
        "addresses": [
            "1.1.1.1",
            "1.0.0.1"
        ]
    },
    {
        "name": "Cloudflare IPv6",
        "type": "udp",
        "addresses": [
            "[2606:4700:4700::1111]",
            "[2606:4700:4700::1001]"
        ]
    },
    {
        "name": "Cloudflare",
        "type": "tcp",
        "addresses": [
            "1.1.1.1",
            "1.0.0.1"
        ]
    },
    {
        "name": "Cloudflare IPv6",
        "type": "tcp",
        "addresses": [
            "[2606:4700:4700::1111]",
            "[2606:4700:4700::1001]"
        ]
    },
    {
        "name": "Cloudflare",
        "type": "tls",
        "addresses": [
            "cloudflare-dns.com (1.1.1.1:853)",
            "cloudflare-dns.com (1.0.0.1:853)"
        ]
    },
    {
        "name": "Cloudflare IPv6",
        "type": "tls",
        "addresses": [
            "cloudflare-dns.com ([2606:4700:4700::1111]:853)",
            "cloudflare-dns.com ([2606:4700:4700::1001]:853)"
        ]
    },
    {
        "name": "Cloudflare",
        "type": "https",
        "addresses": [
            "https://cloudflare-dns.com/dns-query (1.1.1.1)",
            "https://cloudflare-dns.com/dns-query (1.0.0.1)"
        ]
    },
    {
        "name": "Cloudflare",
        "type": "httpsjson",
        "addresses": [
            "https://cloudflare-dns.com/dns-query (1.1.1.1)",
            "https://cloudflare-dns.com/dns-query (1.0.0.1)"
        ]
    },
    {
        "name": "Cloudflare TOR",
        "type": "tcp",
        "addresses": [
            "dns4torpnlfs2ifuz2s2yf3fc7rdmsbhm6rw75euj35pac6ap25zgqad.onion"
        ]
    },

    {
        "name": "Google",
        "type": "udp",
        "addresses": [
            "8.8.8.8",
            "8.8.4.4"
        ]
    },
    {
        "name": "Google IPv6",
        "type": "udp",
        "addresses": [
            "[2001:4860:4860::8888]",
            "[2001:4860:4860::8844]"
        ]
    },
    {
        "name": "Google",
        "type": "tcp",
        "addresses": [
            "8.8.8.8",
            "8.8.4.4"
        ]
    },
    {
        "name": "Google IPv6",
        "type": "tcp",
        "addresses": [
            "[2001:4860:4860::8888]",
            "[2001:4860:4860::8844]"
        ]
    },
    {
        "name": "Google",
        "type": "tls",
        "addresses": [
            "dns.google (8.8.8.8:853)",
            "dns.google (8.8.4.4:853)"
        ]
    },
    {
        "name": "Google IPv6",
        "type": "tls",
        "addresses": [
            "dns.google ([2001:4860:4860::8888]:853)",
            "dns.google ([2001:4860:4860::8844]:853)"
        ]
    },
    {
        "name": "Google",
        "type": "https",
        "addresses": [
            "https://dns.google/dns-query (8.8.8.8)",
            "https://dns.google/dns-query (8.8.4.4)"
        ]
    },
    {
        "name": "Google",
        "type": "httpsjson",
        "addresses": [
            "https://Google-dns.com/dns-query (1.1.1.1)",
            "https://Google-dns.com/dns-query (1.0.0.1)"
        ]
    },


    {
        "name": "Quad9 Secure",
        "type": "udp",
        "addresses": [
            "9.9.9.9"
        ]
    },
    {
        "name": "Quad9 Secure IPv6",
        "type": "udp",
        "addresses": [
            "[2620:fe::fe]"
        ]
    },
    {
        "name": "Quad9 Secure",
        "type": "tcp",
        "addresses": [
            "9.9.9.9"
        ]
    },
    {
        "name": "Quad9 Secure IPv6",
        "type": "tcp",
        "addresses": [
            "[2620:fe::fe]"
        ]
    },
    {
        "name": "Quad9 Secure",
        "type": "tls",
        "addresses": [
            "dns.quad9.net (9.9.9.9:853)"
        ]
    },
    {
        "name": "Quad9 Secure IPv6",
        "type": "tls",
        "addresses": [
            "dns.quad9.net ([2620:fe::fe]:853)"
        ]
    },
    {
        "name": "Quad9 Secure",
        "type": "https",
        "addresses": [
            "https://dns.quad9.net/dns-query (9.9.9.9)"
        ]
    },

    {
        "name": "Quad9 Unsecure",
        "type": "udp",
        "addresses": [
            "9.9.9.10"
        ]
    },
    {
        "name": "Quad9 Unsecure IPv6",
        "type": "udp",
        "addresses": [
            "[2620:fe::10]"
        ]
    },
    {
        "name": "Quad9 Unsecure",
        "type": "tcp",
        "addresses": [
            "9.9.9.10"
        ]
    },
    {
        "name": "Quad9 Unsecure IPv6",
        "type": "tcp",
        "addresses": [
            "[2620:fe::10]"
        ]
    },
    {
        "name": "Quad9 Unsecure",
        "type": "tls",
        "addresses": [
            "dns10.quad9.net (9.9.9.10:853)"
        ]
    },
    {
        "name": "Quad9 Unsecure IPv6",
        "type": "tls",
        "addresses": [
            "dns10.quad9.net ([2620:fe::10]:853)"
        ]
    },
    {
        "name": "Quad9 Unsecure",
        "type": "https",
        "addresses": [
            "https://dns10.quad9.net/dns-query (9.9.9.10)"
        ]
    },

    {
        "name": "OpenDNS",
        "type": "udp",
        "addresses": [
            "208.67.222.222",
            "208.67.220.220"
        ]
    },
    {
        "name": "OpenDNS IPv6",
        "type": "udp",
        "addresses": [
            "[2620:0:ccc::2]",
            "[2620:0:ccd::2]"
        ]
    },
    {
        "name": "OpenDNS",
        "type": "tcp",
        "addresses": [
            "208.67.222.222",
            "208.67.220.220"
        ]
    },
    {
        "name": "OpenDNS IPv6",
        "type": "tcp",
        "addresses": [
            "[2620:0:ccc::2]",
            "[2620:0:ccd::2]"
        ]
    },
    {
        "name": "OpenDNS Family Shield",
        "type": "tcp",
        "addresses": [
            "208.67.222.123",
            "208.67.220.123"
        ]
    }
]