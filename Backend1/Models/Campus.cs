using System.ComponentModel.DataAnnotations;

namespace Backend1.Models
{
    public class Campus
    {
        [Key]
        public int CampusID { get; set; }
        public string Address { get; set; }
    }
}
