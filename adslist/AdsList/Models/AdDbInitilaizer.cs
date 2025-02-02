using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity;

namespace AdsList.Models
{
    public class AdDbInitializer : DropCreateDatabaseAlways <AdContext>
    {
        protected override void Seed(AdContext context)
        {
            GetDefaultAds().ForEach(ad => context.Ads.Add(ad));
        }

        protected static List<Ad> GetDefaultAds()
        {
            return new List<Ad> {
                new Ad() {
                    Id = 1,
                    Text = "This is the first ad.",
                    Approved = true,
                    Status = ReviewStatus.InReview,
                    CreatorUser = "admin"
                },
                new Ad() {
                    Id = 2,
                    Text = "FCK",
                    Approved = false,
                    Status = ReviewStatus.WaitingForReview,
                    CreatorUser = "admin"
                }
            };
        }
    }
}