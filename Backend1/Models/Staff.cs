using System.ComponentModel.DataAnnotations;

namespace Backend1.Models
{
    public class Staff
    {
        [Key]
        public int StaffID { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public int CampusID { get; set; }
        public string Password { get; set; }
        public Campus Campus { get; set; }

        public Account? Account { get; set; }
    }
}
