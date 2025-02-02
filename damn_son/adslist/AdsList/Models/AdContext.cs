using System;
using System.Collections.Generic;
using System.Linq;
using System.Data.Entity;

namespace AdsList.Models
{
    public class AdContext : DbContext
    {
        public AdContext()
            : base("AdsList")
        {
        }

        public DbSet<Ad> Ads { get; set; }
    }
}