// init component process... is a process without user interaction

// from objectviewer foreach object child
// 0.  var content_templates_container = $("<ul></ul>");
// 1. content_template=load tmpl 'object_viewer_content' with data:child
// 2. content_templates_container.append(content_template);
// 3. init component/object.js >> enterpriseweb_site_components_object(child)
// >> 3.1   enterpriseweb_site_components_object.ensure_container_attributes ---> namely, ensure the component has an unique  id
// >> 3.2  enterpriseweb_site_components_object_+'object.type'(render) ---> load template and use 
// >> 3.3 this.enterpriseweb_site_components_validation() ---> search for validation css classes  
// >> 3.4 this.enterpriseweb_site_components_actions() --> search in json properties for actions and evaluate each action'_extension'.js

// >> 3.4 this.enterpriseweb_site_components_metadata()  search in json properties for metadata and evaluate each metadata'_extension'.js





