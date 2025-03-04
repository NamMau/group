using Asp.Versioning;
using Backend1.Dtos;
using Backend1.Models;
using Backend1.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend1.Controllers
{
    [Route("api/v{version:apiVersion}/students")]
    [ApiController]
    [ApiVersion("1.0", Deprecated = false)]
    [ApiVersion("2.0")]
    [ApiExplorerSettings(GroupName = "v1")]
    public class StudentsController : ControllerBase
    {
        private readonly IStudentService _studentService;

        public StudentsController(IStudentService studentService)
        {
            _studentService = studentService;
        }

        /// <summary>
        /// Get student by ID.
        /// </summary>
        /// <param name="id"></param>
        /// <returns>Student details</returns>
        [HttpGet("{id}")]
        [MapToApiVersion("1.0")]
        [ProducesResponseType(typeof(StudentDto), 200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetStudentById(int id)
        {
            var student = await _studentService.GetStudentByIdAsync(id);
            if (student == null)
                return NotFound(new { Message = "Student not found" });

            return Ok(student);
        }

        /// <summary>
        /// Get all students.
        /// </summary>
        /// <returns>List of students</returns>
        [HttpGet]
        [MapToApiVersion("1.0")]
        [ProducesResponseType(typeof(IEnumerable<StudentDto>), 200)]
        public async Task<IActionResult> GetAllStudents()
        {
            var students = await _studentService.GetAllStudentsAsync();
            return Ok(students);
        }

        /// <summary>
        /// Create a new student.
        /// </summary>
        /// <param name="student"></param>
        /// <returns>Created student</returns>
        [HttpPost]
        [MapToApiVersion("1.0")]
        [ProducesResponseType(typeof(Student), 201)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> CreateStudent([FromBody] Student student)
        {
            if (student == null)
                return BadRequest(new { Message = "Invalid student data" });

            var createdStudent = await _studentService.CreateStudentAsync(student);
            return CreatedAtAction(nameof(GetStudentById), new { id = createdStudent.StudentID }, createdStudent);
        }

        /// <summary>
        /// Update student information.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="updatedStudent"></param>
        /// <returns>No content if successful</returns>
        [HttpPut("{id}")]
        [MapToApiVersion("1.0")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> UpdateStudent(int id, [FromBody] StudentDto updatedStudent)
        {
            if (updatedStudent == null)
                return BadRequest(new { Message = "Invalid student data" });

            var result = await _studentService.UpdateStudentAsync(id, updatedStudent);
            if (!result)
                return NotFound(new { Message = "Student not found" });

            return NoContent();
        }

        /// <summary>
        /// Delete a student by ID.
        /// </summary>
        /// <param name="id"></param>
        /// <returns>No content if successful</returns>
        [HttpDelete("{id}")]
        [MapToApiVersion("1.0")]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> DeleteStudent(int id)
        {
            var result = await _studentService.DeleteStudentAsync(id);
            if (!result)
                return NotFound(new { Message = "Student not found" });

            return NoContent();
        }
    }
}
