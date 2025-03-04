namespace Backend1.Dtos
{
    public class StudentDto
    {
        public int StudentID { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public int CampusID { get; set; }
        public string Address { get; set; }  // Updated from CampusName to Address
    }
}
