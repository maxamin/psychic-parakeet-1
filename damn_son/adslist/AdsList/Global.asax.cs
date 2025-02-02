using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Routing;
using System.Web.Security;
using AdsList;
using System.Data.Entity;
using AdsList.Models;

namespace AdsList
{
    public class Global : HttpApplication
    {
        void Application_Start(object sender, EventArgs e)
        {
            // Code that runs on application startup
            RoleConfig.ConfigureRoles();
            Database.SetInitializer(new AdDbInitializer());
        }
    }
}
