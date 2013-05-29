// curl -s -X POST http://192.168.1.22:35357/v2.0/tokens \
// >     -d '{"auth": {"passwordCredentials": {"username":"demo", "password":"password"}, "tenantName":"invisible_to_admin"}}' \
// >     -H "Content-type: application/json" | jq .

var response={
    "access": {
        "metadata": {
            "roles": [
                "4466fb355b904e8a9df3ce1e4cbc898b"
            ],
            "is_admin": 0
        },
        "user": {
            "name": "demo",
            "roles": [
                {
                    "name": "Member"
                }
            ],
            "id": "79f982429edc47cc892984770ccd7105",
            "roles_links": [],
            "username": "demo"
        },
        "serviceCatalog": [
            {
                "name": "nova",
                "type": "compute",
                "endpoints_links": [],
                "endpoints": [
                    {
                        "publicURL": "http://192.168.1.22:8774/v2/c0480dcb24ec477c85e7f2449c5ff956",
                        "id": "36a4654e86bb493e8823f854315c159c",
                        "internalURL": "http://192.168.1.22:8774/v2/c0480dcb24ec477c85e7f2449c5ff956",
                        "region": "RegionOne",
                        "adminURL": "http://192.168.1.22:8774/v2/c0480dcb24ec477c85e7f2449c5ff956"
                    }
                ]
            },
            {
                "name": "s3",
                "type": "s3",
                "endpoints_links": [],
                "endpoints": [
                    {
                        "publicURL": "http://192.168.1.22:3333",
                        "id": "3b088dd5891b479680f36cd5a9d37063",
                        "internalURL": "http://192.168.1.22:3333",
                        "region": "RegionOne",
                        "adminURL": "http://192.168.1.22:3333"
                    }
                ]
            },
            {
                "name": "glance",
                "type": "image",
                "endpoints_links": [],
                "endpoints": [
                    {
                        "publicURL": "http://192.168.1.22:9292",
                        "id": "0491601dd7aa436ab29210d5389c8f59",
                        "internalURL": "http://192.168.1.22:9292",
                        "region": "RegionOne",
                        "adminURL": "http://192.168.1.22:9292"
                    }
                ]
            },
            {
                "name": "cinder",
                "type": "volume",
                "endpoints_links": [],
                "endpoints": [
                    {
                        "publicURL": "http://192.168.1.22:8776/v1/c0480dcb24ec477c85e7f2449c5ff956",
                        "id": "3bee2f56173243c1a10281bfc8b244cd",
                        "internalURL": "http://192.168.1.22:8776/v1/c0480dcb24ec477c85e7f2449c5ff956",
                        "region": "RegionOne",
                        "adminURL": "http://192.168.1.22:8776/v1/c0480dcb24ec477c85e7f2449c5ff956"
                    }
                ]
            },
            {
                "name": "ec2",
                "type": "ec2",
                "endpoints_links": [],
                "endpoints": [
                    {
                        "publicURL": "http://192.168.1.22:8773/services/Cloud",
                        "id": "02b86c66378140b0b7a187639617c54d",
                        "internalURL": "http://192.168.1.22:8773/services/Cloud",
                        "region": "RegionOne",
                        "adminURL": "http://192.168.1.22:8773/services/Admin"
                    }
                ]
            },
            {
                "name": "keystone",
                "type": "identity",
                "endpoints_links": [],
                "endpoints": [
                    {
                        "publicURL": "http://192.168.1.22:5000/v2.0",
                        "id": "637d08d838dc4bb0b904c37ab722b117",
                        "internalURL": "http://192.168.1.22:5000/v2.0",
                        "region": "RegionOne",
                        "adminURL": "http://192.168.1.22:35357/v2.0"
                    }
                ]
            }
        ],
        "token": {
            "tenant": {
                "name": "invisible_to_admin",
                "id": "c0480dcb24ec477c85e7f2449c5ff956",
                "enabled": true,
                "description": null
            },
            "id": "MIIKYwYJKoZIhvcNAQcCoIIKVDCCClACAQExCTAHBgUrDgMCGjCCCTwGCSqGSIb3DQEHAaCCCS0EggkpeyJhY2Nlc3MiOiB7InRva2VuIjogeyJpc3N1ZWRfYXQiOiAiMjAxMy0wNS0yOFQxNjowMDowOC4xMjIzMDkiLCAiZXhwaXJlcyI6ICIyMDEzLTA1LTI5VDE2OjAwOjA4WiIsICJpZCI6ICJwbGFjZWhvbGRlciIsICJ0ZW5hbnQiOiB7ImRlc2NyaXB0aW9uIjogbnVsbCwgImVuYWJsZWQiOiB0cnVlLCAiaWQiOiAiYzA0ODBkY2IyNGVjNDc3Yzg1ZTdmMjQ0OWM1ZmY5NTYiLCAibmFtZSI6ICJpbnZpc2libGVfdG9fYWRtaW4ifX0sICJzZXJ2aWNlQ2F0YWxvZyI6IFt7ImVuZHBvaW50cyI6IFt7ImFkbWluVVJMIjogImh0dHA6Ly8xOTIuMTY4LjEuMjI6ODc3NC92Mi9jMDQ4MGRjYjI0ZWM0NzdjODVlN2YyNDQ5YzVmZjk1NiIsICJyZWdpb24iOiAiUmVnaW9uT25lIiwgImludGVybmFsVVJMIjogImh0dHA6Ly8xOTIuMTY4LjEuMjI6ODc3NC92Mi9jMDQ4MGRjYjI0ZWM0NzdjODVlN2YyNDQ5YzVmZjk1NiIsICJpZCI6ICIzNmE0NjU0ZTg2YmI0OTNlODgyM2Y4NTQzMTVjMTU5YyIsICJwdWJsaWNVUkwiOiAiaHR0cDovLzE5Mi4xNjguMS4yMjo4Nzc0L3YyL2MwNDgwZGNiMjRlYzQ3N2M4NWU3ZjI0NDljNWZmOTU2In1dLCAiZW5kcG9pbnRzX2xpbmtzIjogW10sICJ0eXBlIjogImNvbXB1dGUiLCAibmFtZSI6ICJub3ZhIn0sIHsiZW5kcG9pbnRzIjogW3siYWRtaW5VUkwiOiAiaHR0cDovLzE5Mi4xNjguMS4yMjozMzMzIiwgInJlZ2lvbiI6ICJSZWdpb25PbmUiLCAiaW50ZXJuYWxVUkwiOiAiaHR0cDovLzE5Mi4xNjguMS4yMjozMzMzIiwgImlkIjogIjNiMDg4ZGQ1ODkxYjQ3OTY4MGYzNmNkNWE5ZDM3MDYzIiwgInB1YmxpY1VSTCI6ICJodHRwOi8vMTkyLjE2OC4xLjIyOjMzMzMifV0sICJlbmRwb2ludHNfbGlua3MiOiBbXSwgInR5cGUiOiAiczMiLCAibmFtZSI6ICJzMyJ9LCB7ImVuZHBvaW50cyI6IFt7ImFkbWluVVJMIjogImh0dHA6Ly8xOTIuMTY4LjEuMjI6OTI5MiIsICJyZWdpb24iOiAiUmVnaW9uT25lIiwgImludGVybmFsVVJMIjogImh0dHA6Ly8xOTIuMTY4LjEuMjI6OTI5MiIsICJpZCI6ICIwNDkxNjAxZGQ3YWE0MzZhYjI5MjEwZDUzODljOGY1OSIsICJwdWJsaWNVUkwiOiAiaHR0cDovLzE5Mi4xNjguMS4yMjo5MjkyIn1dLCAiZW5kcG9pbnRzX2xpbmtzIjogW10sICJ0eXBlIjogImltYWdlIiwgIm5hbWUiOiAiZ2xhbmNlIn0sIHsiZW5kcG9pbnRzIjogW3siYWRtaW5VUkwiOiAiaHR0cDovLzE5Mi4xNjguMS4yMjo4Nzc2L3YxL2MwNDgwZGNiMjRlYzQ3N2M4NWU3ZjI0NDljNWZmOTU2IiwgInJlZ2lvbiI6ICJSZWdpb25PbmUiLCAiaW50ZXJuYWxVUkwiOiAiaHR0cDovLzE5Mi4xNjguMS4yMjo4Nzc2L3YxL2MwNDgwZGNiMjRlYzQ3N2M4NWU3ZjI0NDljNWZmOTU2IiwgImlkIjogIjNiZWUyZjU2MTczMjQzYzFhMTAyODFiZmM4YjI0NGNkIiwgInB1YmxpY1VSTCI6ICJodHRwOi8vMTkyLjE2OC4xLjIyOjg3NzYvdjEvYzA0ODBkY2IyNGVjNDc3Yzg1ZTdmMjQ0OWM1ZmY5NTYifV0sICJlbmRwb2ludHNfbGlua3MiOiBbXSwgInR5cGUiOiAidm9sdW1lIiwgIm5hbWUiOiAiY2luZGVyIn0sIHsiZW5kcG9pbnRzIjogW3siYWRtaW5VUkwiOiAiaHR0cDovLzE5Mi4xNjguMS4yMjo4NzczL3NlcnZpY2VzL0FkbWluIiwgInJlZ2lvbiI6ICJSZWdpb25PbmUiLCAiaW50ZXJuYWxVUkwiOiAiaHR0cDovLzE5Mi4xNjguMS4yMjo4NzczL3NlcnZpY2VzL0Nsb3VkIiwgImlkIjogIjAyYjg2YzY2Mzc4MTQwYjBiN2ExODc2Mzk2MTdjNTRkIiwgInB1YmxpY1VSTCI6ICJodHRwOi8vMTkyLjE2OC4xLjIyOjg3NzMvc2VydmljZXMvQ2xvdWQifV0sICJlbmRwb2ludHNfbGlua3MiOiBbXSwgInR5cGUiOiAiZWMyIiwgIm5hbWUiOiAiZWMyIn0sIHsiZW5kcG9pbnRzIjogW3siYWRtaW5VUkwiOiAiaHR0cDovLzE5Mi4xNjguMS4yMjozNTM1Ny92Mi4wIiwgInJlZ2lvbiI6ICJSZWdpb25PbmUiLCAiaW50ZXJuYWxVUkwiOiAiaHR0cDovLzE5Mi4xNjguMS4yMjo1MDAwL3YyLjAiLCAiaWQiOiAiNjM3ZDA4ZDgzOGRjNGJiMGI5MDRjMzdhYjcyMmIxMTciLCAicHVibGljVVJMIjogImh0dHA6Ly8xOTIuMTY4LjEuMjI6NTAwMC92Mi4wIn1dLCAiZW5kcG9pbnRzX2xpbmtzIjogW10sICJ0eXBlIjogImlkZW50aXR5IiwgIm5hbWUiOiAia2V5c3RvbmUifV0sICJ1c2VyIjogeyJ1c2VybmFtZSI6ICJkZW1vIiwgInJvbGVzX2xpbmtzIjogW10sICJpZCI6ICI3OWY5ODI0MjllZGM0N2NjODkyOTg0NzcwY2NkNzEwNSIsICJyb2xlcyI6IFt7Im5hbWUiOiAiTWVtYmVyIn1dLCAibmFtZSI6ICJkZW1vIn0sICJtZXRhZGF0YSI6IHsiaXNfYWRtaW4iOiAwLCAicm9sZXMiOiBbIjQ0NjZmYjM1NWI5MDRlOGE5ZGYzY2UxZTRjYmM4OThiIl19fX0xgf8wgfwCAQEwXDBXMQswCQYDVQQGEwJVUzEOMAwGA1UECBMFVW5zZXQxDjAMBgNVBAcTBVVuc2V0MQ4wDAYDVQQKEwVVbnNldDEYMBYGA1UEAxMPd3d3LmV4YW1wbGUuY29tAgEBMAcGBSsOAwIaMA0GCSqGSIb3DQEBAQUABIGAlzzS92edU0Q39uVgERPTGPwXsYgT3KSUX3ojbQp7tsgUYWpQg3UGFQmdD-n+ZFIju2yy8fVquBTGLBbsUlLFm8bcyKzou285PlDRM-5ZMCoqrxjfn9BhDUeFmgnGOTWQU5vTrYHuwmWPl26RCPt7ORSDhi96neGAfd+OvnWdCr4=",
            "expires": "2013-05-29T16:00:08Z",
            "issued_at": "2013-05-28T16:00:08.122309"
        }
    }
};
