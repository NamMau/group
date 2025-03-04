using Backend1.Dtos;
using Backend1.Models;

namespace Backend1.Repositories
{
    public interface IStudentRepository
    {
        Task<StudentDto> GetStudentByIdAsync(int id);
        Task<IEnumerable<StudentDto>> GetAllStudentsAsync();
        Task<Student> CreateStudentAsync(Student student);
        Task<bool> UpdateStudentAsync(int id, StudentDto updatedStudent);
        Task<bool> DeleteStudentAsync(int id);
    }
}
