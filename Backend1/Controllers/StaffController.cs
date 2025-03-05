using Asp.Versioning;
using Backend1.Dtos;
using Backend1.Models;
using Backend1.Services;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Backend1.Controllers
{
    // Define the API route with versioning
    [Route("api/v{version:apiVersion}/staffs")]
    [ApiController]
    [ApiVersion("1.0")]
    public class StaffController : ControllerBase
    {
        private readonly IStaffService _staffService;

        // Constructor injection for StaffService
        public StaffController(IStaffService staffService)
        {
            _staffService = staffService;
        }

        // Get a specific staff member by ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetStaffById(int id)
        {
            var staffDto = await _staffService.GetStaffByIdAsync(id);
            if (staffDto == null)
                return NotFound(new { Message = "Staff not found" });

            return Ok(staffDto);
        }

        // Get a list of all staff members
        [HttpGet("All")]
        public async Task<IActionResult> GetAllStaff()
        {
            var staffs = await _staffService.GetAllStaffAsync();
            return Ok(staffs);
        }

        // Create a new staff member
        [HttpPost]
        public async Task<IActionResult> CreateStaff([FromBody] Staff staff)
        {
            var createdStaff = await _staffService.CreateStaffAsync(staff);
            if (createdStaff == null)
                return BadRequest(new { Message = "Invalid data provided" });

            return CreatedAtAction(nameof(GetStaffById), new { id = createdStaff.StaffID }, createdStaff);
        }

        // Update an existing staff member's details
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStaff(int id, [FromBody] StaffDto updatedStaff)
        {
            var success = await _staffService.UpdateStaffAsync(id, updatedStaff);
            if (!success)
                return NotFound(new { Message = "Staff not found or invalid data" });

            return NoContent();
        }

        // Delete a staff member by ID
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStaff(int id)
        {
            var success = await _staffService.DeleteStaffAsync(id);
            if (!success)
                return NotFound(new { Message = "Staff not found" });

            return NoContent();
        }
    }
}
