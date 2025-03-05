using Backend1.Dtos;
using Backend1.Models;
using Backend1.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace Backend1.Services
{
    public class StaffService : IStaffService
    {
        private readonly IStaffRepository _staffRepository;

        public StaffService(IStaffRepository staffRepository)
        {
            _staffRepository = staffRepository;
        }

        public async Task<StaffDto?> GetStaffByIdAsync(int id)
        {
            if (id <= 0) return null;
            return await _staffRepository.GetStaffByIdAsync(id);
        }

        public async Task<IEnumerable<StaffDto>> GetAllStaffAsync()
        {
            return await _staffRepository.GetAllStaffAsync();
        }

        public async Task<Staff?> CreateStaffAsync(Staff staff)
        {
            if (string.IsNullOrEmpty(staff.Name) || string.IsNullOrEmpty(staff.Email))
                return null;

            return await _staffRepository.CreateStaffAsync(staff);
        }

        public async Task<bool> UpdateStaffAsync(int id, StaffDto updatedStaff)
        {
            if (string.IsNullOrEmpty(updatedStaff.Name) || string.IsNullOrEmpty(updatedStaff.Email))
                return false;

            return await _staffRepository.UpdateStaffAsync(id, updatedStaff);
        }

        public async Task<bool> DeleteStaffAsync(int id)
        {
            return await _staffRepository.DeleteStaffAsync(id);
        }
    }
}
