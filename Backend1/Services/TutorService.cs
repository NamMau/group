using Backend1.Data;
using Backend1.Dtos;
using Backend1.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend1.Services
{
    public class TutorService : ITutorService
    {
        private readonly AppDbContext _context;
        
        public TutorService(AppDbContext context)
        {
            _context = context;
        }

        //Get tutor by id
        public async Task<TutorDto> GetTutorByIdAsync(int id)
        {   
            return await _context.Tutors
                .Where(t => t.TutorID == id)
                .Select(t => new TutorDto
                {
                    TutorID = t.TutorID,
                    Name = t.Name ?? string.Empty,
                    Email = t.Email ?? string.Empty,
                    CampusID = t.CampusID
                })
                .FirstOrDefaultAsync() ?? null;
        }

        //Get all tutors
        public async Task<IEnumerable<TutorDto>> GetAllTutorsAsync()
        {
            return await _context.Tutors
                .Select(t => new TutorDto
                {
                    TutorID = t.TutorID,
                    Name = t.Name,
                    Email = t.Email,
                    CampusID = t.CampusID
                })
                .ToListAsync();
        }

        //Add new tutor
        public async Task<Tutor> CreateTutorAsync(Tutor tutor)
        {
            tutor.Password = BCrypt.Net.BCrypt.HashPassword(tutor.Password);
            _context.Tutors.Add(tutor);
            await _context.SaveChangesAsync();
            return tutor;
        }

        //Update tutor that existing
        public async Task<bool> UpdateTutorAsync(int id, TutorDto updatedTutor)
        {
            var tutor = await _context.Tutors.FindAsync(id);
            if(tutor == null) return false;

            tutor.Name = updatedTutor.Name;
            tutor.Email = updatedTutor.Email;
            tutor.CampusID = updatedTutor.CampusID;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteTutorAsync(int id)
        {
            var tutor = await _context.Tutors.FindAsync(id);
            if(tutor == null) return false;

            _context.Tutors.Remove(tutor);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
