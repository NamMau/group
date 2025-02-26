namespace Backend1.Repositories
{
    public interface IAccountRepository
    {
        Task<AccountDto> GetAccountByIdAsync(int id);
        Task<IEnumerable<AccountDto>> GetAllAccountsAsync();
    }
}
