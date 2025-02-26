namespace Backend1.Services
{
    public interface ITokenService
    {
        string GenerateToken(int userId, string email, string role);
    }
}
