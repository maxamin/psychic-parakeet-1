using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using AdsList.Models;

namespace AdsList.Admin
{
    public partial class Review : System.Web.UI.Page
    {
        protected Ad EditedAd;
        protected AdContext context;

        protected void Page_Load(object sender, EventArgs e)
        {
            context = new AdContext();
            EditedAd = context.Ads.Find(Int32.Parse(Request.QueryString["id"]));
            if (!IsPostBack)
            {
                EditedAd.Status = ReviewStatus.InReview;
                context.SaveChanges();
                DataBind();
            }
        }

        protected void Approve(object sender, EventArgs e)
        {
            EditedAd.Approved = true;
            EditedAd.Status = ReviewStatus.Reviewed;
            context.SaveChanges();
            Response.Redirect("/Admin/Admin.aspx?AdQUery=unapproved");
        }

        protected void Reject(object sender, EventArgs e)
        {
            EditedAd.Approved = false;
            EditedAd.Status = ReviewStatus.Reviewed;
            context.SaveChanges();
            Response.Redirect("/Admin/Admin.aspx?AdQUery=unapproved");
        }

        protected void Update(object sender, EventArgs e)
        {
            EditedAd.Text = AdTextUpdate.Text;
            context.SaveChanges();
            DataBind();
        }
    }
}