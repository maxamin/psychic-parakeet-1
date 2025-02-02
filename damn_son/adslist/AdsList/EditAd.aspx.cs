using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using AdsList.Models;

namespace AdsList
{
    public partial class EditAd : System.Web.UI.Page
    {
        protected Ad EditedAd;
        protected AdContext context;

        protected void Page_Load(object sender, EventArgs e)
        {
            context = new AdContext();
            EditedAd = context.Ads.Find(Int32.Parse(Request.QueryString["id"]));
            if (!IsPostBack)
            {
                DataBind();
            }
        }

        protected void Update(object sender, EventArgs e)
        {
            EditedAd.Text = AdTextUpdate.Text;
            EditedAd.Approved = false;
            EditedAd.Status = ReviewStatus.WaitingForReview;
            context.SaveChanges();
            DataBind();
        }
    }
}