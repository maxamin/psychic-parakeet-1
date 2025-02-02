using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Security;

namespace AdsList
{
    public class RoleConfig
    {
        public static void ConfigureRoles()
        {
            try
            {
                Membership.CreateUser("approver", "approver");
                Membership.CreateUser("admin", "admin123");
                Membership.CreateUser("testuser", "testuser");
            }
            catch (MembershipCreateUserException)
            {}//Already created

            if (!Roles.RoleExists("admin"))
            {
                Roles.CreateRole("admin");
            }
            if (!Roles.RoleExists("approver"))
            {
                Roles.CreateRole("approver");
            }
            if (!Roles.IsUserInRole("admin", "admin"))
            {
                Roles.AddUserToRole("admin", "admin");
            }
            if (!Roles.IsUserInRole("approver", "approver"))
            {
                Roles.AddUserToRole("approver", "approver");
            }
        }
    }
}