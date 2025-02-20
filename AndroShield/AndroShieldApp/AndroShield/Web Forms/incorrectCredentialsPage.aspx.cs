﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AndroApp.Web_Forms
{
    public partial class incorrectCredentialsPage : System.Web.UI.Page
    {
        databaseLayer androDatabase;
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                if(Request.UrlReferrer == null)
                    Response.Redirect("homePage.aspx");

                androDatabase = new databaseLayer();

            }
        }

        protected void loginBtn_Click(object sender, EventArgs e)
        {
            Session["tempUsername"] = emailTxt.Text.ToString();
            Session["tempPassword"] = passwordTxt.Text.ToString();
            Session["userAccount"] = userAccountTable.userLogin(Session["tempUsername"].ToString(), Session["tempPassword"].ToString());


            if (Session["userAccount"] != null)
            {
                Session["username"] = Session["tempUsername"].ToString();
                Session["password"] = Session["tempPassword"].ToString();

                Response.Redirect("userHomePage.aspx");
            }
            else
            {
                Response.Redirect("incorrectCredentialsPage.aspx");
            }
            Session.Contents.Remove("tempUsername");
            Session.Contents.Remove("tempPassword");
        }

        protected void signupNav_Click(object sender, EventArgs e)
        {
            Response.Redirect("signUpPage.aspx");
        }
    }
}