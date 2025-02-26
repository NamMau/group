using System.ComponentModel.DataAnnotations;

namespace Backend1.Models
{
    public class Message
    {
        [Key]
        public int MessageID { get; set; }
        public int SenderID { get; set; }
        public int Receiver { get; set; }
        public DateTime TimeStamp { get; set; }
        public string Content { get; set; }
    }
}
