using Backend1.Data;
using Backend1.Dtos;
using Backend1.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend1.Repositories
{
    public class TutorRepository : ITutorRepository
    {
        private readonly AppDbContext _context;

        public TutorRepository(AppDbContext context)
        {
            _context = context;
        }

        //Get Tutor by ID
        public async Task<TutorDto?> GetTutorByIdAsync(int id)
        {
            var tutor = await _context.Tutors
                .Where(t => t.TutorID == id)
                .Select(t => new TutorDto
                {
                    TutorID = t.TutorID,
                    Name = t.Name ?? string.Empty,  // Prevents null reference
                    Email = t.Email ?? string.Empty,
                    CampusID = t.CampusID
                })
                .FirstOrDefaultAsync();

            return tutor;
        }

        //Get All Tutors
        public async Task<IEnumerable<TutorDto>> GetAllTutorsAsync()
        {
            return await _context.Tutors
                .Select(t => new TutorDto
                {
                    TutorID = t.TutorID,
                    Name = t.Name ?? string.Empty,
                    Email = t.Email ?? string.Empty,
                    CampusID = t.CampusID
                })
                .ToListAsync();
        }

        //Add New Tutor
        public async Task<Tutor> CreateTutorAsync(Tutor tutor)
        {
            _context.Tutors.Add(tutor);
            await _context.SaveChangesAsync();
            return tutor;
        }

        //Update Tutor
        public async Task<bool> UpdateTutorAsync(int id, TutorDto updatedTutor)
        {
            var tutor = await _context.Tutors.FindAsync(id);
            if (tutor == null) return false;

            tutor.Name = updatedTutor.Name;
            tutor.Email = updatedTutor.Email;
            tutor.CampusID = updatedTutor.CampusID;

            await _context.SaveChangesAsync();
            return true;
        }

        //Delete Tutor
        public async Task<bool> DeleteTutorAsync(int id)
        {
            var tutor = await _context.Tutors.FindAsync(id);
            if (tutor == null) return false;

            _context.Tutors.Remove(tutor);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
