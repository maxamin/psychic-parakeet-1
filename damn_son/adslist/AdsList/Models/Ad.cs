using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace AdsList.Models
{
    public enum ReviewStatus { WaitingForReview, InReview, Reviewed}

    public class Ad 
    {
        [ScaffoldColumn(false)]
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set;}

        [Required, StringLength(4000), Display(Name = "Ad Text")]
        public string Text { get; set; }

        public bool Approved { get; set; }

        public ReviewStatus Status { get; set; }

        [Required, StringLength(100)]
        public string CreatorUser { get; set; }

        [StringLength(200)]
        public String TokenValue { get; set; }
    }
}