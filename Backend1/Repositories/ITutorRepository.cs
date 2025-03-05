using Backend1.Dtos;
using Backend1.Models;

namespace Backend1.Repositories
{
    public interface ITutorRepository
    {
        Task<TutorDto?> GetTutorByIdAsync(int id);
        Task<IEnumerable<TutorDto>> GetAllTutorsAsync();
        Task<Tutor> CreateTutorAsync(Tutor tutor);
        Task<bool> UpdateTutorAsync(int id, TutorDto updatedTutor);
        Task<bool> DeleteTutorAsync(int id);
    }
}
