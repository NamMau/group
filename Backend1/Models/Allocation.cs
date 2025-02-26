using System.ComponentModel.DataAnnotations;

namespace Backend1.Models
{
    public class Allocation
    {
        [Key]
        public int AllocationID { get; set; }
        public int StudentID { get; set; }
        public int TutorID { get; set; }
        public int AssignedBy { get; set; }
        public DateTime Timestamp { get; set; }
    }
}
