using Asp.Versioning;
using Backend1.Dtos;
using Backend1.Models;
using Backend1.Services;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Backend1.Controllers
{
    [Route("api/v{version:apiVersion}/tutors")]
    [ApiController]
    [ApiVersion("1.0")]
    public class TutorController : ControllerBase
    {
        private readonly ITutorService _tutorService;

        public TutorController(ITutorService tutorService)
        {
            _tutorService = tutorService;
        }


        //Get Tutor by ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetTutorById(int id)
        {
            var tutor = await _tutorService.GetTutorByIdAsync(id);
            if (tutor == null)
                return NotFound(new { Message = "Tutor not found" });

            return Ok(tutor);
        }


        //Get All Tutors
        [HttpGet]
        public async Task<IActionResult> GetAllTutors()
        {
            var tutors = await _tutorService.GetAllTutorsAsync();
            return Ok(tutors);
        }


        //Create New Tutor
        [HttpPost]
        public async Task<IActionResult> CreateTutor([FromBody] TutorDto tutorDto)
        {
            if (tutorDto == null)
                return BadRequest(new { Message = "Invalid data" });

            var tutor = new Tutor
            {
                Name = tutorDto.Name,
                Email = tutorDto.Email,
                CampusID = tutorDto.CampusID,
                Password = tutorDto.Password // Will be hashed in service
            };

            var createdTutor = await _tutorService.CreateTutorAsync(tutor);

            return CreatedAtAction(nameof(GetTutorById), new { id = createdTutor.TutorID }, createdTutor);
        }


        //Update Tutor
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTutor(int id, [FromBody] TutorDto updatedTutor)
        {
            var result = await _tutorService.UpdateTutorAsync(id, updatedTutor);
            if (!result)
                return NotFound(new { Message = "Tutor not found" });

            return Ok(new { Message = "Tutor updated successfully" });
        }

        //Delete Tutor
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTutor(int id)
        {
            var result = await _tutorService.DeleteTutorAsync(id);
            if (!result)
                return NotFound(new { Message = "Tutor not found" });

            return Ok(new { Message = "Tutor deleted successfully" });
        }
    }
}
