using Backend1.Dtos;
using Backend1.Models;

namespace Backend1.Repositories
{
    public interface IAccountRepository
    {
        Task<AccountDtos?> GetAccountByIdAsync(int id);
        Task<IEnumerable<AccountDtos>> GetAllAccountsAsync();
        Task<Account> CreateAccountAsync(Account addAccount);
        Task<bool> UpdateAccountAsync(int id, Account updatedAccount);
        Task<bool> DeleteAccountAsync(int id);
    }
}
