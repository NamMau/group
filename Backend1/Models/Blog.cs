using System.ComponentModel.DataAnnotations;

namespace Backend1.Models
{
    public class Blog
    {
        [Key]
        public int BlogID { get; set; }
        public int AuthorID { get; set; }
        public string Title { get; set; }
        public DateTime PostedDate { get; set; }
        public string BlogContent { get; set; }
    }
}
