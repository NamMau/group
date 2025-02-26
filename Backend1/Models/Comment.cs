using System.ComponentModel.DataAnnotations;

namespace Backend1.Models
{
    public class Comment
    {
        [Key]
        public int CommentID { get; set; }
        public int DocumentID { get; set; }
        public int CommenterID { get; set; }
        public string CommentText { get; set; }
        public DateTime Timestamp { get; set; }
    }
}
