const AccessControl = require("accesscontrol");
const ac = new AccessControl();
 
exports.roles = (function() {
ac.grant("user")
 .readOwn("profile")
 
 
ac.grant("admin")
 .extend("user")
 .deleteAny("profile")
 
return ac;
})();