define(["js/common.js", "js/open_stack/loadings.js", "js/open_stack/dao.js"], function (common, loadings, dao) {
    function doc(o, _alert){
        _alert=_alert || 0;
        if(_alert==0)
            console.dir(o);
        else if(_alert==1)
            console.log(common.toJson(o));
        else
            alert(common.toJson(o));
        
    };

    return describe("open_stack_tests", function() {





        function call_fn(fn, match_fn){
            var op=new Callback();
            runs(function() {
                fn.fn(data_state, op.callback);
            });
            
            waitsFor(function() {
                if(op.finished()){
                    return true;
                }else{
                    return false;
                }
            }, "The value must be setted", 10000);
            runs(match_fn);
        };
        function Callback(){
            var contador=0;
            return {
                callback:function(error, data_state){
                    if(!error)
                        contador++;
                },
                finished: function(){
                    if(contador>0){
                        return true;
                    }else{
                        return false;
                    }
                }
            };
            
        }

        

        var    data_state={host:'localhost:3000', user:"demo", password:"password", ip:"192.168.1.22"};
        

        describe("open_stack_loadings", function() {
            
            it("the token_id with 'demo' user login must be defined", function() {
                call_fn(loadings.tokens, 
                        function() {
                            expect(data_state.token_id).toBeDefined();
                            doc({response:[
                                {
                                    "hidden": "demo",
                                    "visible": "demo",
                                    "item": {
                                        "description": null,
                                        "enabled": true,
                                        "id": "465ee0bb9b0b41389c5f181efa600188",
                                        "name": "demo"
                                    }
                                },
                                {
                                    "hidden": "invisible_to_admin",
                                    "visible": "invisible_to_admin",
                                    "item": {
                                        "description": null,
                                        "enabled": true,
                                        "id": "9663c2db50d24ba3ab85347e89ec51f0",
                                        "name": "invisible_to_admin"
                                    }
                                }
                            ]});
                        });

            });

            it("loading_tenants", function() {
                call_fn(loadings.tenants, 
                        function() {
                            expect(data_state.tenants_select).toBeDefined();
                        });
            });

            it("loading_endpoints_for_first_tenant", function() {
                data_state.tenant_name=data_state.tenants_select[0].item.name;
                data_state.tenant_id=data_state.tenants_select[0].item.id;
                call_fn(loadings.endpoints, 
                        function() {
                            expect(data_state.service_catalog_select).toBeDefined();
                            doc( {response:
                                  [
                                      {
                                          "item": {
                                              "endpoints": [
                                                  {
                                                      "adminURL": "http://192.168.1.22:8774/v2/465ee0bb9b0b41389c5f181efa600188",
                                                      "region": "RegionOne",
                                                      "internalURL": "http://192.168.1.22:8774/v2/465ee0bb9b0b41389c5f181efa600188",
                                                      "id": "0d8fe2e87c1b4f039d2c4f8a1eb513c9",
                                                      "publicURL": "http://192.168.1.22:8774/v2/465ee0bb9b0b41389c5f181efa600188"
                                                  }
                                              ],
                                              "endpoints_links": [],
                                              "type": "compute",
                                              "name": "nova"
                                          },
                                          "hidden": "nova",
                                          "visible": "nova:compute"
                                      },
                                      {
                                          "item": {
                                              "endpoints": [
                                                  {
                                                      "adminURL": "http://192.168.1.22:3333",
                                                      "region": "RegionOne",
                                                      "internalURL": "http://192.168.1.22:3333",
                                                      "id": "300f4d36fb9b446f8dfeb43a4ceab73e",
                                                      "publicURL": "http://192.168.1.22:3333"
                                                  }
                                              ],
                                              "endpoints_links": [],
                                              "type": "s3",
                                              "name": "s3"
                                          },
                                          "hidden": "s3",
                                          "visible": "s3:s3"
                                      },
                                      {
                                          "item": {
                                              "endpoints": [
                                                  {
                                                      "adminURL": "http://192.168.1.22:9292",
                                                      "region": "RegionOne",
                                                      "internalURL": "http://192.168.1.22:9292",
                                                      "id": "79b64d892b244f3881740...0de7c",
                                                      "publicURL": "http://192.168.1.22:8776/v1/465ee0bb9b0b41389c5f181efa600188"
                                                  }
                                              ],
                                              "endpoints_links": [],
                                              "type": "volume",
                                              "name": "cinder"
                                          },
                                          "hidden": "cinder",
                                          "visible": "cinder:volume"
                                      },
                                      {
                                          "item": {
                                              "endpoints": [
                                                  {
                                                      "adminURL": "http://192.168.1.22:8773/services/Admin",
                                                      "region": "RegionOne",
                                                      "internalURL": "http://192.168.1.22:8773/services/Cloud",
                                                      "id": "4ec7133bb6c14e83ab1f034c3b2e6032",
                                                      "publicURL": "http://192.168.1.22:8773/services/Cloud"
                                                  }
                                              ],
                                              "endpoints_links": [],
                                              "type": "ec2",
                                              "name": "ec2"
                                          },
                                          "hidden": "ec2",
                                          "visible": "ec2:ec2"
                                      },
                                      {
                                          "item": {
                                              "endpoints": [
                                                  {
                                                      "adminURL": "http://192.168.1.22:35357/v2.0",
                                                      "region": "RegionOne",
                                                      "internalURL": "http://192.168.1.22:5000/v2.0",
                                                      "id": "5d03fca5f74d46978ed569fd3162503c",
                                                      "publicURL": "http://192.168.1.22:5000/v2.0"
                                                  }
                                              ],
                                              "endpoints_links": [],
                                              "type": "identity",
                                              "name": "keystone"
                                          },
                                          "hidden": "keystone",
                                          "visible": "keystone:identity"
                                      }
                                  ]});

                        });
            });

            it("select nova endpoint and operations", function(){
                data_state.option_service_selected=data_state.service_catalog_select[0].item;
                data_state.option_service_selected_name=data_state.option_service_selected.name;
                expect(data_state.option_service_selected_name).toEqual("nova");
                call_fn(loadings.nova_operations, function(){
                    expect(data_state.suboptions_select.length).toBeGreaterThan(0);
                    doc([
                        {
                            "item": {
                                "service_type": "compute",
                                "url": "/images"
                            },
                            "visible": "LIST IMAGES",
                            "hidden": "nova-images"
                        },
                        {
                            "item": {
                                "service_type": "compute",
                                "url": "/flavors"
                            },
                            "visible": "LIST FLAVORS",
                            "hidden": "nova-flavors"
                        },
                        {
                            "item": {
                                "service_type": "compute",
                                "url": "/servers"
                            },
                            "visible": "LIST SERVERS",
                            "hidden": "nova-servers"
                        }/** ...more or less ... **/
                    ]);
                });

            });



            it("prepare dao and dao operation: nova images", function(){

                var data_operation=data_state.suboptions_select[0];
                data_state.data_operation={
                    title:data_operation.hidden
                    ,url:data_operation.item.url
                    ,host:data_state.option_service_selected.endpoints[0].publicURL
                };

                doc(data_state.data_operation);

                call_fn(loadings.prepare_operation, function(){
                    var result=data_state.dao;
                    expect(data_state.dao.action).toContain("operations");

                    doc({
                        "method": "POST",
                        "action": "http://localhost:3000/operations",
                        "data": {
                            "token": "MIIKYwYJKoZIhvcNAQcCoIIKVDCCClACAQExCTAHBgUrDgMCGjCCCTwGCSqGSIb3DQEHAaCCCS0EggkpeyJhY2Nlc3MiOiB7InRva2VuIjogeyJpc3N1ZWRfYXQiOiAiMjAxMy0wNi0xM1QxMTo0MDowNC41MDI1MTEiLCAiZXhwaXJlcyI6ICIyMDEzLTA2LTE0VDExOjQwOjA0WiIsICJpZCI6ICJwbGFjZWhvbGRlciIsICJ0ZW5hbnQiOiB7ImRlc2NyaXB0aW9uIjogbnVsbCwgImVuYWJsZWQiOiB0cnVlLCAiaWQiOiAiMzc4OTE4ZTg5ZTJiNGYxNmE3M2Q0MGVlYTJmOWNkOWUiLCAibmFtZSI6ICJpbnZpc2libGVfdG9fYWRtaW4ifX0sICJzZXJ2aWNlQ2F0YWxvZyI6IFt7ImVuZHBvaW50cyI6IFt7ImFkbWluVVJMIjogImh0dHA6Ly8xOTIuMTY4LjEuMjI6ODc3NC92Mi8zNzg5MThlODllMmI0ZjE2YTczZDQwZWVhMmY5Y2Q5ZSIsICJyZWdpb24iOiAiUmVnaW9uT25lIiwgImludGVybmFsVVJMIjogImh0dHA6Ly8xOTIuMTY4LjEuMjI6ODc3NC92Mi8zNzg5MThlODllMmI0ZjE2YTczZDQwZWVhMmY5Y2Q5ZSIsICJpZCI6ICJiN2ViMDhkMTYwOTg0OGFmYjdhNWE0N2UxNTFiNGQyMyIsICJwdWJsaWNVUkwiOiAiaHR0cDovLzE5Mi4xNjguMS4yMjo4Nzc0L3YyLzM3ODkxOGU4OWUyYjRmMTZhNzNkNDBlZWEyZjljZDllIn1dLCAiZW5kcG9pbnRzX2xpbmtzIjogW10sICJ0eXBlIjogImNvbXB1dGUiLCAibmFtZSI6ICJub3ZhIn0sIHsiZW5kcG9pbnRzIjogW3siYWRtaW5VUkwiOiAiaHR0cDovLzE5Mi4xNjguMS4yMjozMzMzIiwgInJlZ2lvbiI6ICJSZWdpb25PbmUiLCAiaW50ZXJuYWxVUkwiOiAiaHR0cDovLzE5Mi4xNjguMS4yMjozMzMzIiwgImlkIjogIjc0OGI5OWFiZGM4YzQ0NDBiNGQ2NTE4OTk2YWJhNWQ2IiwgInB1YmxpY1VSTCI6ICJodHRwOi8vMTkyLjE2OC4xLjIyOjMzMzMifV0sICJlbmRwb2ludHNfbGlua3MiOiBbXSwgInR5cGUiOiAiczMiLCAibmFtZSI6ICJzMyJ9LCB7ImVuZHBvaW50cyI6IFt7ImFkbWluVVJMIjogImh0dHA6Ly8xOTIuMTY4LjEuMjI6OTI5MiIsICJyZWdpb24iOiAiUmVnaW9uT25lIiwgImludGVybmFsVVJMIjogImh0dHA6Ly8xOTIuMTY4LjEuMjI6OTI5MiIsICJpZCI6ICIwYWE5OTA5OGQwNDU0YTFhODczOWZlM2E4MTIzMjAwMiIsICJwdWJsaWNVUkwiOiAiaHR0cDovLzE5Mi4xNjguMS4yMjo5MjkyIn1dLCAiZW5kcG9pbnRzX2xpbmtzIjogW10sICJ0eXBlIjogImltYWdlIiwgIm5hbWUiOiAiZ2xhbmNlIn0sIHsiZW5kcG9pbnRzIjogW3siYWRtaW5VUkwiOiAiaHR0cDovLzE5Mi4xNjguMS4yMjo4Nzc2L3YxLzM3ODkxOGU4OWUyYjRmMTZhNzNkNDBlZWEyZjljZDllIiwgInJlZ2lvbiI6ICJSZWdpb25PbmUiLCAiaW50ZXJuYWxVUkwiOiAiaHR0cDovLzE5Mi4xNjguMS4yMjo4Nzc2L3YxLzM3ODkxOGU4OWUyYjRmMTZhNzNkNDBlZWEyZjljZDllIiwgImlkIjogIjU5ODU4NmNkYzAwNjRmNDg4MGRmMzYwOTNhYzRjYzk4IiwgInB1YmxpY1VSTCI6ICJodHRwOi8vMTkyLjE2OC4xLjIyOjg3NzYvdjEvMzc4OTE4ZTg5ZTJiNGYxNmE3M2Q0MGVlYTJmOWNkOWUifV0sICJlbmRwb2ludHNfbGlua3MiOiBbXSwgInR5cGUiOiAidm9sdW1lIiwgIm5hbWUiOiAiY2luZGVyIn0sIHsiZW5kcG9pbnRzIjogW3siYWRtaW5VUkwiOiAiaHR0cDovLzE5Mi4xNjguMS4yMjo4NzczL3NlcnZpY2VzL0FkbWluIiwgInJlZ2lvbiI6ICJSZWdpb25PbmUiLCAiaW50ZXJuYWxVUkwiOiAiaHR0cDovLzE5Mi4xNjguMS4yMjo4NzczL3NlcnZpY2VzL0Nsb3VkIiwgImlkIjogIjUxMzBkYWQ2MmNiMzQ0NThhZGU5NTk4ZTIzOTQ3MjNjIiwgInB1YmxpY1VSTCI6ICJodHRwOi8vMTkyLjE2OC4xLjIyOjg3NzMvc2VydmljZXMvQ2xvdWQifV0sICJlbmRwb2ludHNfbGlua3MiOiBbXSwgInR5cGUiOiAiZWMyIiwgIm5hbWUiOiAiZWMyIn0sIHsiZW5kcG9pbnRzIjogW3siYWRtaW5VUkwiOiAiaHR0cDovLzE5Mi4xNjguMS4yMjozNTM1Ny92Mi4wIiwgInJlZ2lvbiI6ICJSZWdpb25PbmUiLCAiaW50ZXJuYWxVUkwiOiAiaHR0cDovLzE5Mi4xNjguMS4yMjo1MDAwL3YyLjAiLCAiaWQiOiAiM2RmMDUzNmRhYzVhNDRhZTk0OWE2MTcxN2NmODFjNzQiLCAicHVibGljVVJMIjogImh0dHA6Ly8xOTIuMTY4LjEuMjI6NTAwMC92Mi4wIn1dLCAiZW5kcG9pbnRzX2xpbmtzIjogW10sICJ0eXBlIjogImlkZW50aXR5IiwgIm5hbWUiOiAia2V5c3RvbmUifV0sICJ1c2VyIjogeyJ1c2VybmFtZSI6ICJkZW1vIiwgInJvbGVzX2xpbmtzIjogW10sICJpZCI6ICI5NWIzNjM4NDVkZTY0MThlOWZhOGNmN2M0YWFjMWZjZCIsICJyb2xlcyI6IFt7Im5hbWUiOiAiTWVtYmVyIn1dLCAibmFtZSI6ICJkZW1vIn0sICJtZXRhZGF0YSI6IHsiaXNfYWRtaW4iOiAwLCAicm9sZXMiOiBbIjRlZTFkNzMzYmQwMzQ2YzhiNTNiZTE2YTQxYThmZTc2Il19fX0xgf8wgfwCAQEwXDBXMQswCQYDVQQGEwJVUzEOMAwGA1UECBMFVW5zZXQxDjAMBgNVBAcTBVVuc2V0MQ4wDAYDVQQKEwVVbnNldDEYMBYGA1UEAxMPd3d3LmV4YW1wbGUuY29tAgEBMAcGBSsOAwIaMA0GCSqGSIb3DQEBAQUABIGAbOswjhLqicGZCzfZ6ryHaqR2A4KP4v6KyyLzrxfeZ2eL6DJ3n+z5W1H4Yne0wz77ejexNqxXhE5jo83eSYopxJtEk13KArVEwtbOP56z+SA0i6ZZ7sQp6t7-S0+dHH4elIZ+XBg0uVP14Ftl62Svbk1otCbMFN2d9aaccWqYEyo=",
                            "s_url": "/images",
                            "s_host": "192.168.1.22:8774/v2/378918e89e2b4f16a73d40eea2f9cd9e"
                        }
                    } );
                });
                

                call_fn(dao.dao, function(){
                    var result=data_state.dao.result;
                    expect(data_state.dao.result).toBeDefined();

                    doc(result );
                });
                  call_fn(loadings.show_operation_result, function(){
                    var result=data_state[data_operation.hidden];
                    expect(result.images).toBeDefined();

                    doc(result );
                });
            });



   it("prepare dao and dao operation: nova flavors", function(){

                var data_operation=data_state.suboptions_select[1];
                data_state.data_operation={
                    title:data_operation.hidden
                    ,url:data_operation.item.url
                    ,host:data_state.option_service_selected.endpoints[0].publicURL
                };

                doc(data_state.data_operation);

                call_fn(loadings.prepare_operation, function(){
                    var result=data_state.dao;
                    expect(data_state.dao.action).toContain("operations");

                    doc(result );
                });
                

                call_fn(dao.dao, function(){
                    var result=data_state.dao.result;
                    expect(data_state.dao.result).toBeDefined();

                    doc(result );
                });
                  call_fn(loadings.show_operation_result, function(){
                    var result=data_state[data_operation.hidden];
                    expect(result.flavors).toBeDefined();

                    doc(result );
                });
            });



        });

    });


});
