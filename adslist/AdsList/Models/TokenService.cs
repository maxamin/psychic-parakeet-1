using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AdsList.Models
{
    public class TokenService
    {
        private static Random random = new Random();

        public static String Generate()
        {
            string value = HttpContext.Current.User.Identity.Name;
            value += random.Next(1000000);
            value += random.Next(1000000);
            value += random.Next(1000000);
            value += random.Next(1000000);
            return value;
        }

        public static bool CheckToken(String tokenValue, Ad ad)
        {
            //Check if this is the token for this ad
            return ad.TokenValue == tokenValue;
        }
    }
}