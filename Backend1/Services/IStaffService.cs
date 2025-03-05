using Backend1.Dtos;
using Backend1.Models;

namespace Backend1.Services
{
    public interface IStaffService
    {
        Task<StaffDto?> GetStaffByIdAsync(int id);
        Task<IEnumerable<StaffDto>> GetAllStaffAsync();
        Task<Staff?> CreateStaffAsync(Staff staff);
        Task<bool> UpdateStaffAsync(int id, StaffDto updatedStaff);
        Task<bool> DeleteStaffAsync(int id);
    }
}
