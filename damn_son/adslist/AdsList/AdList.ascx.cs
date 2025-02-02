using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using AdsList.Models;

namespace AdsList
{
    public class AdQuery
    {
        public string DisplayName { get; set; }
        public string QueryName { get; set; }
    }

    public partial class AdList : System.Web.UI.UserControl
    {
        public string QueryName { get; set; }

        public bool ShowSelector { get; set; }

        public bool IsApprover { get { return HttpContext.Current.User.IsInRole("approver") || HttpContext.Current.User.IsInRole("admin"); } }

        protected void Page_Load(object sender, EventArgs e)
        {
            //pattern found at http://msdn.microsoft.com/en-us/library/2d76z3ck(v=vs.110).aspx
            var queries = new List<AdQuery>();
            queries.Add(new AdQuery() { DisplayName = "All Ads", QueryName = "all"});
            queries.Add(new AdQuery() { DisplayName = "Approved Ads", QueryName = "approved" });
            queries.Add(new AdQuery() { DisplayName = "Unapproved Ads", QueryName = "unapproved" });
            QuerySelector.DataSource = queries;
            QuerySelector.DataBind();
        }

        public IQueryable<Ad> GetAds()
        {
            string queryName = QueryName;
            if (!String.IsNullOrEmpty(Request.QueryString["AdQuery"])) {
                queryName = Request.QueryString["AdQuery"];
            }
            var db = new AdsList.Models.AdContext();
            IQueryable<Ad> query = db.Ads;
            switch (queryName)
            {
                case "all":
                    break;
                case "unapproved":
                    query = query.Where(p => p.Approved == false);
                    break;
                case "myads":
                    query = query.Where(p => p.CreatorUser == HttpContext.Current.User.Identity.Name);
                    break;
                case "approved":
                default:
                    query = query.Where(p => p.Approved == true);
                    break;
            }
            return query;
        }

        public string previewText(Ad ad)
        {
            return ad.Text.Substring(0, Math.Min(60, ad.Text.Length));
        }
    }
}