using System.ComponentModel.DataAnnotations;

namespace Backend1.Models
{
    public class Document
    {
        [Key]
        public int DocumentID { get; set; }
        public int StudentID { get; set; }
        public int TutorID { get; set; }
        public string FilePath { get; set; }
        public string FileName { get; set; }
        public DateTime UploadDate { get; set; }
    }
}
