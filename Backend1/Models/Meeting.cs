using System.ComponentModel.DataAnnotations;

namespace Backend1.Models
{
    public class Meeting
    {
        [Key]
        public int MeetingID { get; set; }
        public int StudentID { get; set; }
        public int TutorID { get; set; }
        public string MeetingType { get; set; }
        public DateTime DateTime { get; set; }
        public string Note { get; set; }
    }
}
