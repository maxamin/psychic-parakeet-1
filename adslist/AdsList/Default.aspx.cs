using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using AdsList.Models;

namespace AdsList
{
    public partial class _Default : Page
    {
        protected string Message;

        protected bool EnableAutoApprove
        {
            get { return User.IsInRole("approver"); }
        }

        protected void Page_Load(object sender, EventArgs e)
        {
                DataBind();
        }

        protected void PostAd(object sender, EventArgs e)
        {
            AdContext context = new AdContext();
            Ad ad = new Ad
            {
                Id = 1,
                Text = Neutralize(AdText.Text),
                CreatorUser = User.Identity.Name,
                Status = ReviewStatus.WaitingForReview,
                Approved = AutoApprove.Checked
            };
            context.Ads.Add(ad);
            context.SaveChanges();
            AdText.Text = "";
            Message = "Ad Posted. An Approver will check and approve it soon!";
        }

        public string Neutralize(string input)
        {
            return input.Replace("<script", "").Replace("<form", "").Replace("<iframe", "").Replace("onclick", "").Replace("onload", "");
        }
    }
}