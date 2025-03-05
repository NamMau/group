using Backend1.Data;
using Backend1.Dtos;
using Backend1.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend1.Repositories
{
    public class StaffRepository : IStaffRepository
    {
        private readonly AppDbContext _context;

        public StaffRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<StaffDto?> GetStaffByIdAsync(int id)
        {
            return await _context.Staffs
                .Where(s => s.StaffID == id)
                .Select(s => new StaffDto
                {
                    StaffID = s.StaffID,
                    Name = s.Name,
                    Email = s.Email
                })
                .FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<StaffDto>> GetAllStaffAsync()
        {
            return await _context.Staffs
                .Select(s => new StaffDto
                {
                    StaffID = s.StaffID,
                    Name = s.Name,
                    Email = s.Email
                })
                .ToListAsync();
        }

        public async Task<Staff?> CreateStaffAsync(Staff staff)
        {
            if (string.IsNullOrEmpty(staff.Name) || string.IsNullOrEmpty(staff.Email))
                return null;

            _context.Staffs.Add(staff);
            await _context.SaveChangesAsync();
            return staff;
        }

        public async Task<bool> UpdateStaffAsync(int id, StaffDto updatedStaff)
        {
            var staff = await _context.Staffs.FindAsync(id);
            if (staff == null) return false;

            staff.Name = updatedStaff.Name;
            staff.Email = updatedStaff.Email;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteStaffAsync(int id)
        {
            var staff = await _context.Staffs.FindAsync(id);
            if (staff == null) return false;

            _context.Staffs.Remove(staff);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
