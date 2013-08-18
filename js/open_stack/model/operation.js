define(["js/common.js", "js/pipelines/dispatcher.js", "js/open_stack/model/token.js"],
       function(common, dispatcher, token_model) {



           var result= {
               name:"operation",
               dao_requirements:["tenant_name", "user", "password"],
               data_state_key:"endpoints",
               instanciate_container:function(data_state){
                   data_state[result.data_state_key]={};
                   return result.get_model(data_state);
               },
               populate_container:function(data_state, dao_result){
                   // storing all data in data_state.endpoints_response
                   //data_state.endpoints_response=dao_result;

                   dao_result.access.serviceCatalog.map(function(item){
                       result.get_model(data_state)[item.name]=item.endpoints[0].publicURL.replace(common.local_ip,data_state.ip );
                   });

                   $('#content').prepend( "<h2>endPoints analysed:</h2><pre><code class='json'>"+common.toJson(data_state.endpoints)+"</code></pre>" );                                        
                   // to store new token_id
                   token_model.populate_container(data_state, dao_result);

               },
               get_model:function(data_state){
                   return data_state[result.data_state_key];
               },
               get_selected_name:function(data_state){
                   return data_state.tenant_name;
               },
               set_selected:function(data_state, item){
                   data_state.tenant_name=item.name;
                   data_state.tenant_id=item.id;
               },
               example_single_tenant_ajax_response:{
  "access": {
    "token": {
      "issued_at": "2013-08-17T13:41:36.834246",
      "expires": "2013-08-18T13:41:36Z",
      "id": "MIIL6gYJKoZIhvcNAQcCoIIL2zCCC9cCAQExCTAHBgUrDgMCGjCCCkAGCSqGSIb3DQEHAaCCCjEEggoteyJhY2Nlc3MiOiB7InRva2VuIjogeyJpc3N1ZWRfYXQiOiAiMjAxMy0wOC0xN1QxMzo0MTozNi44MzQyNDYiLCAiZXhwaXJlcyI6ICIyMDEzLTA4LTE4VDEzOjQxOjM2WiIsICJpZCI6ICJwbGFjZWhvbGRlciIsICJ0ZW5hbnQiOiB7ImRlc2NyaXB0aW9uIjogbnVsbCwgImVuYWJsZWQiOiB0cnVlLCAiaWQiOiAiMTI3MTFlMGNhMmFmNDFhMjk3NzI3NDZjZTdiNDM5NTMiLCAibmFtZSI6ICJhZG1pbiJ9fSwgInNlcnZpY2VDYXRhbG9nIjogW3siZW5kcG9pbnRzIjogW3siYWRtaW5VUkwiOiAiaHR0cDovLzE5Mi4xNjguMS4yNjo4Nzc0L3YyLzEyNzExZTBjYTJhZjQxYTI5NzcyNzQ2Y2U3YjQzOTUzIiwgInJlZ2lvbiI6ICJSZWdpb25PbmUiLCAiaW50ZXJuYWxVUkwiOiAiaHR0cDovLzE5Mi4xNjguMS4yNjo4Nzc0L3YyLzEyNzExZTBjYTJhZjQxYTI5NzcyNzQ2Y2U3YjQzOTUzIiwgImlkIjogIjNiNTU4N2MxOWJmZDQxM2E5YjlmNjgxNDMzMzExZGMyIiwgInB1YmxpY1VSTCI6ICJodHRwOi8vMTkyLjE2OC4xLjI2Ojg3NzQvdjIvMTI3MTFlMGNhMmFmNDFhMjk3NzI3NDZjZTdiNDM5NTMifV0sICJlbmRwb2ludHNfbGlua3MiOiBbXSwgInR5cGUiOiAiY29tcHV0ZSIsICJuYW1lIjogIm5vdmEifSwgeyJlbmRwb2ludHMiOiBbeyJhZG1pblVSTCI6ICJodHRwOi8vMTkyLjE2OC4xLjI2Ojk2OTYvIiwgInJlZ2lvbiI6ICJSZWdpb25PbmUiLCAiaW50ZXJuYWxVUkwiOiAiaHR0cDovLzE5Mi4xNjguMS4yNjo5Njk2LyIsICJpZCI6ICIyYTkyY2IzNTc5OTA0OWFiOGQ5YWU5NTcyNjY0ODBlMSIsICJwdWJsaWNVUkwiOiAiaHR0cDovLzE5Mi4xNjguMS4yNjo5Njk2LyJ9XSwgImVuZHBvaW50c19saW5rcyI6IFtdLCAidHlwZSI6ICJuZXR3b3JrIiwgIm5hbWUiOiAicXVhbnR1bSJ9LCB7ImVuZHBvaW50cyI6IFt7ImFkbWluVVJMIjogImh0dHA6Ly8xOTIuMTY4LjEuMjY6MzMzMyIsICJyZWdpb24iOiAiUmVnaW9uT25lIiwgImludGVybmFsVVJMIjogImh0dHA6Ly8xOTIuMTY4LjEuMjY6MzMzMyIsICJpZCI6ICIwMzRlMTNkODAyOWI0NDdkYTM3ODU0MTE5NWQ0OWY3NyIsICJwdWJsaWNVUkwiOiAiaHR0cDovLzE5Mi4xNjguMS4yNjozMzMzIn1dLCAiZW5kcG9pbnRzX2xpbmtzIjogW10sICJ0eXBlIjogInMzIiwgIm5hbWUiOiAiczMifSwgeyJlbmRwb2ludHMiOiBbeyJhZG1pblVSTCI6ICJodHRwOi8vMTkyLjE2OC4xLjI2OjkyOTIiLCAicmVnaW9uIjogIlJlZ2lvbk9uZSIsICJpbnRlcm5hbFVSTCI6ICJodHRwOi8vMTkyLjE2OC4xLjI2OjkyOTIiLCAiaWQiOiAiMWRiNDA4YzcyZDk2NGY3Mjg4ZDM4ZDYyOTczNTgxZjciLCAicHVibGljVVJMIjogImh0dHA6Ly8xOTIuMTY4LjEuMjY6OTI5MiJ9XSwgImVuZHBvaW50c19saW5rcyI6IFtdLCAidHlwZSI6ICJpbWFnZSIsICJuYW1lIjogImdsYW5jZSJ9LCB7ImVuZHBvaW50cyI6IFt7ImFkbWluVVJMIjogImh0dHA6Ly8xOTIuMTY4LjEuMjY6ODc3Ni92MS8xMjcxMWUwY2EyYWY0MWEyOTc3Mjc0NmNlN2I0Mzk1MyIsICJyZWdpb24iOiAiUmVnaW9uT25lIiwgImludGVybmFsVVJMIjogImh0dHA6Ly8xOTIuMTY4LjEuMjY6ODc3Ni92MS8xMjcxMWUwY2EyYWY0MWEyOTc3Mjc0NmNlN2I0Mzk1MyIsICJpZCI6ICIxMWUxODE2ODA1MmI0OTgxYmRiMzk3NzdmZGU3ZmNjMyIsICJwdWJsaWNVUkwiOiAiaHR0cDovLzE5Mi4xNjguMS4yNjo4Nzc2L3YxLzEyNzExZTBjYTJhZjQxYTI5NzcyNzQ2Y2U3YjQzOTUzIn1dLCAiZW5kcG9pbnRzX2xpbmtzIjogW10sICJ0eXBlIjogInZvbHVtZSIsICJuYW1lIjogImNpbmRlciJ9LCB7ImVuZHBvaW50cyI6IFt7ImFkbWluVVJMIjogImh0dHA6Ly8xOTIuMTY4LjEuMjY6ODc3My9zZXJ2aWNlcy9BZG1pbiIsICJyZWdpb24iOiAiUmVnaW9uT25lIiwgImludGVybmFsVVJMIjogImh0dHA6Ly8xOTIuMTY4LjEuMjY6ODc3My9zZXJ2aWNlcy9DbG91ZCIsICJpZCI6ICIxOTg4NDc1MmY4YWI0ZGEwODZhM2QxMWIzNmQwM2EzNSIsICJwdWJsaWNVUkwiOiAiaHR0cDovLzE5Mi4xNjguMS4yNjo4NzczL3NlcnZpY2VzL0Nsb3VkIn1dLCAiZW5kcG9pbnRzX2xpbmtzIjogW10sICJ0eXBlIjogImVjMiIsICJuYW1lIjogImVjMiJ9LCB7ImVuZHBvaW50cyI6IFt7ImFkbWluVVJMIjogImh0dHA6Ly8xOTIuMTY4LjEuMjY6MzUzNTcvdjIuMCIsICJyZWdpb24iOiAiUmVnaW9uT25lIiwgImludGVybmFsVVJMIjogImh0dHA6Ly8xOTIuMTY4LjEuMjY6NTAwMC92Mi4wIiwgImlkIjogIjRlNzc3M2I4OTdmZjQ4YmU4MWY2OTkwY2UxZWFlODVhIiwgInB1YmxpY1VSTCI6ICJodHRwOi8vMTkyLjE2OC4xLjI2OjUwMDAvdjIuMCJ9XSwgImVuZHBvaW50c19saW5rcyI6IFtdLCAidHlwZSI6ICJpZGVudGl0eSIsICJuYW1lIjogImtleXN0b25lIn1dLCAidXNlciI6IHsidXNlcm5hbWUiOiAiYWRtaW4iLCAicm9sZXNfbGlua3MiOiBbXSwgImlkIjogIjZkY2E2OGI5NTRiZDQ0YjU5ODJhMmVhZGZiZWE1MzAxIiwgInJvbGVzIjogW3sibmFtZSI6ICJhZG1pbiJ9XSwgIm5hbWUiOiAiYWRtaW4ifSwgIm1ldGFkYXRhIjogeyJpc19hZG1pbiI6IDAsICJyb2xlcyI6IFsiZGY5ZjM3MDNlNTBhNDRhM2JjOTRiOTZmODVmNzhhNWQiXX19fTGCAYEwggF9AgEBMFwwVzELMAkGA1UEBhMCVVMxDjAMBgNVBAgTBVVuc2V0MQ4wDAYDVQQHEwVVbnNldDEOMAwGA1UEChMFVW5zZXQxGDAWBgNVBAMTD3d3dy5leGFtcGxlLmNvbQIBATAHBgUrDgMCGjANBgkqhkiG9w0BAQEFAASCAQA8kgeTCZ0VipZhCVTBHtECEbGH8CivqMhXzrHS-vWtYug9n7ZDOwtVjQSol82FtdWiC-XpttqQ-EKRNIRMVOXMPlh-4THvnl72kVkcycfeYMfG0Fvv27Y1V08qRZOgbHOet+VIzlWtUo5s2-jDmFv2CX6ZD5FHom+ZwTeRGEeMIaXBshKKZHq3hHJiSzhVG9AxQR6212tQNkTCkZp8NliWUWoXFi1jG4A-Po5xWaEd+SGkMdvzFbQOGQWmP4wtzwwuSNuBfEa6Jbr9nPibArR9G6J-nw2sTW5i48Jf0IVfTo6BQe1BFnljntSr0eTjwEXIiRBUseUuUwKgGitAq-+y",
      "tenant": {
        "description": null,
        "enabled": true,
        "id": "12711e0ca2af41a29772746ce7b43953",
        "name": "admin"
      }
    },
    "serviceCatalog": [
      {
        "endpoints": [
          {
            "adminURL": "http://192.168.1.26:8774/v2/12711e0ca2af41a29772746ce7b43953",
            "region": "RegionOne",
            "internalURL": "http://192.168.1.26:8774/v2/12711e0ca2af41a29772746ce7b43953",
            "id": "3b5587c19bfd413a9b9f681433311dc2",
            "publicURL": "http://192.168.1.26:8774/v2/12711e0ca2af41a29772746ce7b43953"
          }
        ],
        "endpoints_links": [],
        "type": "compute",
        "name": "nova"
      },
      {
        "endpoints": [
          {
            "adminURL": "http://192.168.1.26:9696/",
            "region": "RegionOne",
            "internalURL": "http://192.168.1.26:9696/",
            "id": "2a92cb35799049ab8d9ae957266480e1",
            "publicURL": "http://192.168.1.26:9696/"
          }
        ],
        "endpoints_links": [],
        "type": "network",
        "name": "quantum"
      },
      {
        "endpoints": [
          {
            "adminURL": "http://192.168.1.26:3333",
            "region": "RegionOne",
            "internalURL": "http://192.168.1.26:3333",
            "id": "034e13d8029b447da378541195d49f77",
            "publicURL": "http://192.168.1.26:3333"
          }
        ],
        "endpoints_links": [],
        "type": "s3",
        "name": "s3"
      },
      {
        "endpoints": [
          {
            "adminURL": "http://192.168.1.26:9292",
            "region": "RegionOne",
            "internalURL": "http://192.168.1.26:9292",
            "id": "1db408c72d964f7288d38d62973581f7",
            "publicURL": "http://192.168.1.26:9292"
          }
        ],
        "endpoints_links": [],
        "type": "image",
        "name": "glance"
      },
      {
        "endpoints": [
          {
            "adminURL": "http://192.168.1.26:8776/v1/12711e0ca2af41a29772746ce7b43953",
            "region": "RegionOne",
            "internalURL": "http://192.168.1.26:8776/v1/12711e0ca2af41a29772746ce7b43953",
            "id": "11e18168052b4981bdb39777fde7fcc3",
            "publicURL": "http://192.168.1.26:8776/v1/12711e0ca2af41a29772746ce7b43953"
          }
        ],
        "endpoints_links": [],
        "type": "volume",
        "name": "cinder"
      },
      {
        "endpoints": [
          {
            "adminURL": "http://192.168.1.26:8773/services/Admin",
            "region": "RegionOne",
            "internalURL": "http://192.168.1.26:8773/services/Cloud",
            "id": "19884752f8ab4da086a3d11b36d03a35",
            "publicURL": "http://192.168.1.26:8773/services/Cloud"
          }
        ],
        "endpoints_links": [],
        "type": "ec2",
        "name": "ec2"
      },
      {
        "endpoints": [
          {
            "adminURL": "http://192.168.1.26:35357/v2.0",
            "region": "RegionOne",
            "internalURL": "http://192.168.1.26:5000/v2.0",
            "id": "4e7773b897ff48be81f6990ce1eae85a",
            "publicURL": "http://192.168.1.26:5000/v2.0"
          }
        ],
        "endpoints_links": [],
        "type": "identity",
        "name": "keystone"
      }
    ],
    "user": {
      "username": "admin",
      "roles_links": [],
      "id": "6dca68b954bd44b5982a2eadfbea5301",
      "roles": [
        {
          "name": "admin"
        }
      ],
      "name": "admin"
    },
    "metadata": {
      "is_admin": 0,
      "roles": [
        "df9f3703e50a44a3bc94b96f85f78a5d"
      ]
    }
  }
}

           };

           return result;







       });
