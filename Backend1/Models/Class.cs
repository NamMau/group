using System.ComponentModel.DataAnnotations;

namespace Backend1.Models
{
    public class Class
    {
        [Key]
        public int ClassID { get; set; }
        public string ClassName { get; set; }
        public int CampusID { get; set; }
        public int StaffID { get; set; }
        public int StudentID { get; set; }
        public int TutorID { get; set; }
        public Campus Campus { get; set; }
        public Staff Staff { get; set; }
        public Student Student { get; set; }
        public Tutor Tutor { get; set; }
    }
}
