function toJson(o){
    return console.log(JSON.stringify(o, null, 4));
};

function rename(o, key, key2){
    o[key2]=o[key];
    delete o[key];

}

var POST="POST", GET="GET";
var byte_type="byte",string_type="string", object_type="object", boolean_type="boolean", long_type="long"; 
var status_response_type={
            status:string_type,
            uRL:string_type,
            affectedKeys:
            [ string_type]
        };
var localhost_type={
    multicastAddress:boolean_type,
    anyLocalAddress:boolean_type,
    loopbackAddress:boolean_type,
    linkLocalAddress:boolean_type,
    siteLocalAddress:boolean_type,
    mCGlobal:boolean_type,
    mCNodeLocal:boolean_type,
    mCLinkLocal:boolean_type,
    mCSiteLocal:boolean_type,
    mCOrgLocal:boolean_type,
    hostName:string_type,
    canonicalHostName:string_type,
    address:byte_type,
    hostAddress:string_type,
    localHost:string_type,
    InetAddress:string_type
};

var ip_address=function(o){var clon={};for(var key in o){clon[key]=o[key];}; return clon;}(localhost_type);
delete ip_address["InetAddress"];
ip_address.localHost=localhost_type;

var api={};
api.base={
    description:"",
    method:"",
    url:"",
    data_to_send:"", 
    data_to_recieve:""
};

api.logout={
    description:"Method to clear the authentication token and invalidate it on the system side, effectively Logging the user out of the system",
    method:POST,
    url:"/auth/logout",
    data_to_send:null, 
    data_to_recieve:"ok"
};
api.login={
    description:"Method to acquire an authentication token from the system to allow further API calls",
    method:POST,
    url:"/auth/logout",
    data_to_send:{
        j_username:string_type, 
        j_password:string_type}, 
    data_to_recieve:{
        authorities: [{authority:string_type}],
        credentials: object_type,
        details: object_type,
        principal: object_type,
        authenticated: boolean_type
    }
};
api.active_resources_list={
    description:"Returns a list of the Active(in use) Resources in the system of all clouds for a given central office",
    method:GET,
    url:"/api/activeResources/list/{centraloffice}",
    data_to_send:{centraloffice:string_type}, 
    data_to_recieve:[
        {
            key:string_type,
            computeNodeResources:[
                {
                    key:string_type,
                    vnfInstanceResources:[
                        {
                            key :string_type,
                            serviceName :string_type,
                            cloudInstance:string_type,
                            computeNodeInstance: string_type,
                            totalRam:long_type,
                            totalVirtualCPUCount:long_type,
                            totalDiskspace:long_type
                        }]}]}]
};
api.active_resources_in_cloud_list={
    description:"Returns a list of the Active(in use) Resources in the system for a given cloud",
    method:"GET",
    url:"/api/activeResources/list/{centraloffice}/{cloud}",
    data_to_send:{centraloffice:string_type, cloud:string_type}, 
    data_to_recieve:{
        key:string_type,
        computeNodeResources:[
            {
                key:string_type,
                vnfInstanceResources:[
                    {
                        key :string_type,
                        serviceName :string_type,
                        cloudInstance:string_type,
                        computeNodeInstance: string_type,
                        totalRam:long_type,
                        totalVirtualCPUCount:long_type,
                        totalDiskspace:long_type
                    }]}]}
};
api.active_resources_in_compute_node_list={
    description:"Returns a list of the Active(in use) Resources in the system for a given computeNode",
    method:"GET",
    url:"/api/activeResources/list/{centraloffice}/{cloud}/{cnode}",
    data_to_send:{centraloffice:string_type, cloud:string_type, cnode:string_type}, 
    data_to_recieve:{
        key:string_type,
        vnfInstanceResources:[
            {
                key :string_type,
                serviceName :string_type,
                cloudInstance:string_type,
                computeNodeInstance: string_type,
                totalRam:long_type,
                totalVirtualCPUCount:long_type,
                totalDiskspace:long_type
            }]}
};
api.active_resources_in_virtual_network_feature_list={
    description:"Returns a list of the Active(in use) Resources in the system for a given vnf(virtual network feature)",
    method:"GET",
    url:"/api/activeResources/list/{centraloffice}/{cloud}/{cnode}/{vnf}",
    data_to_send:{centraloffice:string_type, cloud:string_type, cnode:string_type, vnf:string_type}, 
    data_to_recieve:{
        key :string_type,
        serviceName :string_type,
        cloudInstance:string_type,
        computeNodeInstance: string_type,
        totalRam:long_type,
        totalVirtualCPUCount:long_type,
        totalDiskspace:long_type
    }
};
api.available_resources_list=function(){
    var base=Object.create(api.active_resources_list);
    base.description=base.description.replace("Active(in use)", "Available");
    base.url=base.url.replace("active", "available");

    base.data_to_recieve=[
        {
            key:string_type,
            computeNodeResources:[
                {
                    key :string_type,
                    availableRam:long_type,
                    availableVirtualCPUCount:long_type,
                    availableDiskspace:long_type,

                    totalRam:long_type,
                    totalVirtualCPUCount:long_type,
                    totalDiskspace:long_type
                }]}];

    return base;
}();

api.available_resources_in_cloud_list=function(){
    var base=Object.create(api.active_resources_in_cloud_list);
    base.description=base.description.replace("Active(in use)", "Available");
    base.url=base.url.replace("active", "available");

    base.data_to_recieve=api.available_resources_list.data_to_recieve[0];

    return base;
}();
api.available_resources_in_compute_node_list=function(){
    var base=Object.create(api.active_resources_in_compute_node_list);
    base.description=base.description.replace("Active(in use)", "Available");
    base.url=base.url.replace("active", "available");

    base.data_to_recieve=api.available_resources_in_cloud_list.data_to_recieve.computeNodeResources[0];

    return base;
}();



api.security_list=function(){
    var base={
        description:"Returns a list of all security provisions on the system",
        method:GET,
        url:"/api/apiSecurity/list",
        data_to_send:"", 
        data_to_recieve:[
            {
                tenantType:string_type,
                userType:string_type,
                url:string_type,
                readAccess:boolean_type,
                writeAccess:boolean_type,
                singleTenantView:boolean_type,
                securityID:string_type,
                key:string_type
            }
        ]
    };
    return base;
}();

api.security_for_user_and_tenant_list=function(){
    var base={
        description:"Returns the details for a specific security provision based on the ID passed",
        method:GET,
        url:"/api/apiSecurity/list/{userType}/{tenantType}",
        data_to_send:{userType:string_type, tenantType:string_type}, 
        data_to_recieve:api.security_list.data_to_recieve
    };
    return base;
}();



api.central_offices_list=function(){
    var base={
        description:"Returns a list of all of the central offices on the system",
        method:GET,
        url:"/api/centralOffices/list",
        data_to_send:"", 
        data_to_recieve:[
            {
                key:string_type,
                display_name:string_type
            }
        ]
    };
    return base;
}();

api.central_offices_add=function(){
    var base={
        description:"Add a Central Office to the system",
        method:POST,
        url:"/api/centralOffices/add",
        data_to_send:{key:string_type, display_name:string_type}, 
        data_to_recieve:status_response_type

    };
    return base;
}();

api.switches_for_central_office_list=function(){
    var base={
        description:"Returns a list of all of the switches found on a given central office (via @key)",
        method:GET,
        url:"/api/centralOfficeSwitches/get/{key}",
        data_to_send:{key:string_type}, 
        data_to_recieve:[
            {
                key:string_type,
                displayName:string_type,
                portCollection:
                [
                    {
                        key:string_type,
                        displayName:string_type,
                        ipAddressCollection:
                        [
                            {
                                multicastAddress:boolean_type,
                                anyLocalAddress:boolean_type,
                                loopbackAddress:boolean_type,
                                linkLocalAddress:boolean_type,
                                siteLocalAddress:boolean_type,
                                mCGlobal:boolean_type,
                                mCNodeLocal:boolean_type,
                                mCLinkLocal:boolean_type,
                                mCSiteLocal:boolean_type,
                                mCOrgLocal:boolean_type,
                                hostName:string_type,
                                canonicalHostName:string_type,
                                address:byte_type,
                                hostAddress:string_type,
                                localHost: localhost_type
                                
                            }
                        ],
                        ipAddressCollectionAsString:string_type
                    }
                ]
            }
        ]
    };
    return base;
}();

api.switches_for_central_office_add=function(){
    var data_to_s=api.switches_for_central_office_list.data_to_recieve[0];
    data_to_s.centralOfficeKey=string_type;
    var base={
        description:"Add a Physical Device to the system",
        method:POST,
        url:"/api/centralOfficeSwitches/add",
        data_to_send:data_to_s,
        data_to_recieve:status_response_type

    };
    return base;
}();

api.virtual_network_function_types_for_central_office_list=function(){
    var base={
        description:"Returns a list of all of the Virtual Network Function Types currently provisioned on the system",
        method:GET,
        url:"/api/centralOffices/list",
        data_to_send:"", 
        data_to_recieve:[
            {
                key:string_type,
                display_name:string_type,
                minPorts:long_type,
                maxPorts:long_type
                
            }
        ]
    };
    return base;
}();

api.clouds_for_central_office_list=function(){
    var base={
        description:"Get a list of clouds on the system",
        method:GET,
        url:"/api/clouds/list/{centraloffice}",
        data_to_send:{centraloffice:string_type}, 
        data_to_recieve:[
            {
                key:string_type,
                display_name:string_type,
                centralOfficeKey:string_type,
                authorizationURL:string_type
            }
        ]
    };
    return base;
}();


api.clouds_for_central_office_add=function(){
    var base={
        description:"Add a cloud to the system",
        method:POST,
        url:"/api/clouds/add",
        data_to_send:{
            key:string_type,
            display_name:string_type,
            centralOfficeKey:string_type,
            authorizationURL:string_type
        },
        data_to_recieve:status_response_type
    };
    return base;
}();

api.clouds_for_central_office_remove=function(){
    var base={
        description:"Remove  a cloud from the system",
        method:POST,
        url:"/api/clouds/remove",
        data_to_send:{
            key:string_type
        },
        data_to_recieve:status_response_type

    };
    return base;
}();

api.optimization_types_list=function(){
    var base={
        description:"Returns a list of all of the Optimization Types currently provisioned on the system",
        method:GET,
        url:"/api/optimizationTypes/list",
        data_to_send:"",
        data_to_recieve:[{
            name:string_type,
            key:string_type,
            optimizationAttributeMap:[string_type, "->", string_type]
        }]
    };
    return base;
}();

api.service_orders_list=function(){
    var base={
        description:"Returns a list of the Service Orders on the system",
        method:GET,
        url:"/api/services/list",
        data_to_send:"",
        data_to_recieve:[
            {
                key:string_type,
                serviceOrderKey:string_type,
                serviceOrderStatus:string_type,
                interConnectionCollection:
                [
                    [
                        {
                            deviceKey:string_type,
                            mirrored:boolean_type,
                            portKey:string_type
                        },
                        "->",
                        {
                            deviceKey:string_type,
                            mirrored:boolean_type,
                            portKey:string_type
                        }
                    ]
                ],
                vNFsCollection:
                [
                    {
                        key:string_type,
                        displayName:string_type,
                        portCollection:
                        [
                            {
                                key:string_type,
                                displayName:string_type,
                                ipAddressCollection: [ ip_address ],
                                ipAddressCollectionAsString:string_type
                            }
                        ],
                        optimizationCollection:
                        [
                            {
                                name:string_type,
                                key:string_type,
                                optimizationAttributeMap:
                                [ string_type, "->", string_type ]
                            }
                        ],
                        vnfTypeKey:string_type
                    }
                ],
                centralOfficeCollection:
                [
                    {
                        key:string_type,
                        displayName:string_type
                    }
                ]
            }
        ]

    };
    return base;
}();

api.service_orders_remove=function(){
    var base={
        description:"Deletes/Stop a service from the system given the serviceOrderName",
        method:POST,
        url:"/api/services/remove",
        data_to_send:{key:string_type},
        data_to_recieve:status_response_type
    };
    return base;
}();

api.service_orders_add=function(){
    var base={
        description:"Adds a new Service Order to the system with the payload being a String of XML that describes The Service Order (Described via an XSD file)",
        method:POST,
        url:"/api/serviceOrders/add",
        data_to_send:string_type,
        data_to_recieve:string_type
    };
    return base;
}();

api.sites_list=function(){
    var base={
        description:"List the sites on the system",
        method:GET,
        url:"/api/sites/list",
        data_to_send:"",
        data_to_recieve:[
            {
                key:string_type,
                displayName:string_type,
                deviceKey:string_type,
                portKey:string_type,
                tenantKey:string_type
            }
        ]
    };
    return base;
}();

api.sites_add=function(){
    var base={
        description:"Add a site to the system *** ERROR IN METHOD, must be POST",
        method:GET,
        url:"/api/sites/list",
        data_to_send:{
                key:string_type,
                displayName:string_type,
                deviceKey:string_type,
                portKey:string_type,
                tenantKey:string_type
            },
        data_to_recieve:status_response_type
    };
    return base;
}();

api.sites_remove=function(){
    var base={
        description:"Remove a site from the system",
        method:GET,
        url:"/api/sites/list",
        data_to_send:{
                key:string_type
            },
        data_to_recieve:status_response_type
    };
    return base;
}();


api.tenants_list=function(){
    var base={
        description:"Lists all of the available tenants on the system",
        method:GET,
        url:"/api/tenants/list",
        data_to_send:"",
        data_to_recieve:[
            {
                tenantName:string_type,
                addressStreet:string_type,
                addressCity:string_type,
                addressState:string_type,
                addressZip:string_type,
                primaryContactFirstName:string_type,
                primaryContactLastName:string_type,
                primaryContactPhoneNumber:string_type,
                tenantType:string_type,
                key:string_type
            }
        ]

    };
    return base;
}();

api.tenants_add=function(){
    var base={
        description:"Adds a new tenant to the system with all the information of a TenantDTO provided in POST",
        method:POST,
        url:"/api/tenants/add",
        data_to_send:api.tenants_list.data_to_recieve[0],
        data_to_recieve:status_response_type

    };
    return base;
}();
api.tenants_remove=function(){
    var base={
        description:"Deletes a tenant from the system given the ID of the tenant",
        method:POST,
        url:"/api/tenants/remove",
        data_to_send:{key:string_type},
        data_to_recieve:status_response_type

    };
    return base;
}();

api.tenants_update=function(){
    var base={
        description:"Updates an existing tenant to the system with all the information of a TenantDTO provided in POST",
        method:POST,
        url:"/api/tenants/update",
        data_to_send:api.tenants_list.data_to_recieve[0],
        data_to_recieve:status_response_type

    };
    return base;
}();
api.tenant_types_list=function(){
    var base={
        description:"Returns a list of all tenant types on the system",
        method:GET,
        url:"/api/tenantTypes/list",
        data_to_send:"",
        data_to_recieve:[string_type]

    };
    return base;
}();

api.tenant_types_add=function(){
    var base={
        description:"Adds a UserType to the system",
        method:POST,
        url:"/api/tenantTypes/add",
        data_to_send:{key:string_type},
        data_to_recieve:status_response_type

    };
    return base;
}();

api.tenant_types_remove=function(){
    var base={
        description:"Removes a UserType to the system",
        method:POST,
        url:"/api/tenantTypes/remove",
        data_to_send:{key:string_type},
        data_to_recieve:status_response_type

    };
    return base;
}();

api.users_list=function(){
    var base={
        description:"Returns the list of users",
        method:GET,
        url:"/api/users/list",
        data_to_send:"",
        data_to_recieve:[
            {
                login:string_type,
                firstName:string_type,
                lastName:string_type,
                emailAddress:string_type,
                phoneNumber:string_type,
                tenantName:string_type,
                userType:string_type,
                key:string_type
            }
        ]
    };
    return base;
}();

api.users_detail=function(){
    var base={
        description:"Returns the details for a specific user",
        method:GET,
        url:"/api/users/{key}",
        data_to_send:{key:string_type},
        data_to_recieve:api.users_list.data_to_recieve[0]
    };
    return base;
}();

api.users_add=function(){
    var base={
        description:"Adds a user to the system, by passing all the associated info in the POST field It creates a user with a default password of 'changeMe'",
        method:POST,
        url:"/api/users/add",
        data_to_send:api.users_list.data_to_recieve[0],
        data_to_recieve:status_response_type
    };
    return base;
}();

api.users_remove=function(){
    var base={
        description:"Deletes a user from the system given the ID of the user",
        method:POST,
        url:"/api/users/remove",
        data_to_send:{key:string_type},
        data_to_recieve:status_response_type
    };
    return base;
}();

api.users_update=function(){
    var base={
        description:"Updates an existing user to the system with all the information of a UserDTO provided in POST",
        method:POST,
        url:"/api/users/update",
        data_to_send:api.users_list.data_to_recieve[0],
        data_to_recieve:status_response_type
    };
    return base;
}();


api.capabilities_list=function(){
    var base={
        description:"Returns a list of capabilities the currently logged in user can access. This will look like a list of URLS whether or not the user has read or write access to the associated URL.",
        method:GET,
        url:"/api/capabilities/list",
        data_to_send:"",
        data_to_recieve:[
            {
                tenantType:string_type,
                userType:string_type,
                url:string_type,
                readAccess:boolean_type,
                writeAccess:boolean_type,
                singleTenantView:boolean_type,
                securityID:string_type,
                key:string_type
            }
        ]

    };
    return base;
}();


api.current_user_detail=function(){
    var base={
        description:"Returns details about the currently logged in user (all of the info inside of the UserDTO)",
        method:GET,
        url:"/api/userDetails",
        data_to_send:"",
        data_to_recieve:api.users_list.data_to_recieve[0]
    };
    return base;
}();

api.user_types_list=function(){
    var base={
        description:"Returns a list of all the user types on the system",
        method:GET,
        url:"/api/userTypes/list",
        data_to_send:"",
        data_to_recieve:[string_type]
    };
    return base;
}();

api.user_types_add=function(){
    var base={
        description:"Adds a UserType to the system.",
        method:POST,
        url:"/api/userTypes/add",
        data_to_send:{key:string_type},
        data_to_recieve:status_response_type
    };
    return base;
}();

api.user_types_remove=function(){
    var base={
        description:"Removes a UserType from the system.",
        method:POST,
        url:"/api/userTypes/remove",
        data_to_send:{key:string_type},
        data_to_recieve:status_response_type
    };
    return base;
}();

api.version_list=function(){
    var base={
        description:"ERROR in description and posibly in data to receive",
        method:GET,
        url:"/api/version/list",
        data_to_send:"",
        data_to_recieve:string_type
    };
    return base;
}();

console.log("API SCHEMA:");
for(var key in api){
    var item=api[key];
    console.log(key+" - "+item.method+" - "+item.url+" \n");
}

//toJson(api.service_orders_list);

//toJson(api);

//toJson(ip_address);




