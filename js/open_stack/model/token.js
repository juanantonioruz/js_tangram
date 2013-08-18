define(["js/common.js", "js/pipelines/dispatcher.js"],
       function(common, dispatcher) {

           // function (data_state, callback){
           //                    if(data_state.dao.result){
           //                        data_state.token_id=data_state.dao.result.access.token.id;

           //                        $('#content').prepend( "<h2>Token Loaded</h2><pre><code class='json'>"+common.toJson(data_state.dao.result)+"</code></pre>" );
           //TODO


           //                        callback(null, data_state);

           //                    } else
           //                    callback(data_state.dao.error, data_state);
           
           
           //                }

           var result= {
               name:"token",
               dao_requirements:["ip", "user", "password"], // register form fields
               data_state_key:"token_id",
               instanciate_container:function(data_state){
                   data_state[result.data_state_key]={start:true};

                   return result.get_model(data_state);
               },
               populate_container:function(data_state, dao_result){

                   data_state[result.data_state_key]=dao_result.access.token;

               },
               get_model:function(data_state){
                   return data_state[result.data_state_key];
               },
              get_token_id:function(data_state){
                  return result.get_model(data_state).id;
              },

               example_single_tenant_ajax_response:{
                   "access": {
                       "token": {
                           "issued_at": "2013-08-18T15:24:54.476456",
                           "expires": "2013-08-19T15:24:54Z",
                           "id": "MIIC8QYJKoZIhvcNAQcCoIIC4jCCAt4CAQExCTAHBgUrDgMCGjCCAUcGCSqGSIb3DQEHAaCCATgEggE0eyJhY2Nlc3MiOiB7InRva2VuIjogeyJpc3N1ZWRfYXQiOiAiMjAxMy0wOC0xOFQxNToyNDo1NC40NzY0NTYiLCAiZXhwaXJlcyI6ICIyMDEzLTA4LTE5VDE1OjI0OjU0WiIsICJpZCI6ICJwbGFjZWhvbGRlciJ9LCAic2VydmljZUNhdGFsb2ciOiBbXSwgInVzZXIiOiB7InVzZXJuYW1lIjogImFkbWluIiwgInJvbGVzX2xpbmtzIjogW10sICJpZCI6ICJlNzA0MTFkMTBjYTE0OWU5OGI1NWM5ZDQ0ZWY0MTZlNyIsICJyb2xlcyI6IFtdLCAibmFtZSI6ICJhZG1pbiJ9LCAibWV0YWRhdGEiOiB7ImlzX2FkbWluIjogMCwgInJvbGVzIjogW119fX0xggGBMIIBfQIBATBcMFcxCzAJBgNVBAYTAlVTMQ4wDAYDVQQIEwVVbnNldDEOMAwGA1UEBxMFVW5zZXQxDjAMBgNVBAoTBVVuc2V0MRgwFgYDVQQDEw93d3cuZXhhbXBsZS5jb20CAQEwBwYFKw4DAhowDQYJKoZIhvcNAQEBBQAEggEAj6uiRkJ2t74ueZeS1b7nkYxtzyvGCOi28ZHR4pJY933YiYNM5roft3cZHwEwmuqZWaNK8UuZ+Usm6gTRUbrGa9+ezAm2KuSJ1geFg6mALthQ0dfDNHPSiXx08KewijVJEkPmfEETAO6pTjdH+wgZeJm4l260qaXGhH9wMdLCj3Mw4NF5HXL3bdiO7jpazG7Ei+THbhi-acirCA3Y13iInJ9UjfsDn82Q8EUj5BFNxyVcXXEN1DKQx94cd0RWSCqZni+twiMG7GDdBkEZdMd5rnQifheBD8lY563ceY856F+KtHEJZfXcMW7OVno7NGizQl5Oz-f1fhp2KxyBPJKL3Q=="
                       },
                       "serviceCatalog": [],
                       "user": {
                           "username": "admin",
                           "roles_links": [],
                           "id": "e70411d10ca149e98b55c9d44ef416e7",
                           "roles": [],
                           "name": "admin"
                       },
                       "metadata": {
                           "is_admin": 0,
                           "roles": []
                       }
                   }
               }

           };

           return result;







       });
