namespace Backend1.Models
{
    public class Account
    {
        public int AccountID { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }

        // Relationships
        public int? StudentID { get; set; }
        public Student? Student { get; set; }

        public int? TutorID { get; set; }
        public Tutor? Tutor { get; set; }

        public int? StaffID { get; set; }
        public Staff? Staff { get; set; }
    }
}
