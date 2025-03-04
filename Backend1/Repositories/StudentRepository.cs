using Backend1.Data;
using Backend1.Dtos;
using Backend1.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend1.Repositories
{
    public class StudentRepository : IStudentRepository
    {
        private readonly AppDbContext _context;

        public StudentRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<StudentDto> GetStudentByIdAsync(int id)
        {
            var student = await _context.Students
                .Where(s => s.StudentID == id)
                .Select(s => new StudentDto
                {
                    StudentID = s.StudentID,
                    Name = s.Name,
                    Email = s.Email,
                    CampusID = s.CampusID,
                    Address = s.Campus.Address  // Updated to Address
                })
                .FirstOrDefaultAsync();

            return student;
        }

        public async Task<IEnumerable<StudentDto>> GetAllStudentsAsync()
        {
            return await _context.Students
                .Select(s => new StudentDto
                {
                    StudentID = s.StudentID,
                    Name = s.Name,
                    Email = s.Email,
                    CampusID = s.CampusID,
                    Address = s.Campus.Address  // Updated to Address
                })
                .ToListAsync();
        }

        public async Task<Student> CreateStudentAsync(Student student)
        {
            student.Password = BCrypt.Net.BCrypt.HashPassword(student.Password);
            _context.Students.Add(student);
            await _context.SaveChangesAsync();
            return student;
        }

        public async Task<bool> UpdateStudentAsync(int id, StudentDto updatedStudent)
        {
            var student = await _context.Students.FindAsync(id);
            if (student == null) return false;

            student.Name = updatedStudent.Name;
            student.Email = updatedStudent.Email;
            student.CampusID = updatedStudent.CampusID;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteStudentAsync(int id)
        {
            var student = await _context.Students.FindAsync(id);
            if (student == null) return false;

            _context.Students.Remove(student);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
