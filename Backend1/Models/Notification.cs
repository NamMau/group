using System.ComponentModel.DataAnnotations;

namespace Backend1.Models
{
    public class Notification
    {
        [Key]
        public int NotificationID { get; set; }
        public int RecipientID { get; set; }
        public string Message { get; set; }
        public DateTime SentAt { get; set; }
    }
}
