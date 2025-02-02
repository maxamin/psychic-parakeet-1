using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using AdsList.Models;

namespace AdsList
{
    public partial class PublishAd : System.Web.UI.Page
    {
        protected Ad PublishedAd;
        protected AdContext context;

        protected void Page_Load(object sender, EventArgs e)
        {
            context = new AdContext();
            PublishedAd = context.Ads.Find(Int32.Parse(Request.QueryString["id"]));
            Publish();
            if (!IsPostBack)
            {
                DataBind();
            }
        }

        protected void Publish() {
            if (PublishedAd.TokenValue != null)//Already published
            {
                return;
            }
            PublishedAd.TokenValue = TokenService.Generate();
            context.SaveChanges();
        }

        protected String GetUrl()
        {
            return "/Public/ShowAd.aspx?id=" + PublishedAd.Id + "&token=" + PublishedAd.TokenValue;
        }
    }
}