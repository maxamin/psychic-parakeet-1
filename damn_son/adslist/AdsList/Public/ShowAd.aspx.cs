using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using AdsList.Models;

namespace AdsList.Public
{
    public partial class ShowAd : System.Web.UI.Page
    {
        protected Ad DisplayedAd;
        protected AdContext context;

        protected void Page_Load(object sender, EventArgs e)
        {
            context = new AdContext();
            try {
                DisplayedAd = context.Ads.Find(Int32.Parse(Request.QueryString["id"]));
                if (!TokenService.CheckToken(Request.QueryString["token"], DisplayedAd))
                {
                    Response.Redirect("/");
                }
            }
            catch (Exception)
            {
            }
            DataBind();
        }
    }
}