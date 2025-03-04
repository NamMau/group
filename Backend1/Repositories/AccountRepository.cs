using Backend1.Data;
using Backend1.Dtos;
using Backend1.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend1.Repositories
{
    public class AccountRepository : IAccountRepository
    {
        private readonly AppDbContext _context;

        public AccountRepository(AppDbContext context)
        {
            _context = context;
        }

        // Get account by ID
        public async Task<AccountDtos> GetAccountByIdAsync(int id)
        {
            var account = await _context.Accounts
                .Where(a => a.AccountID == id)
                .Select(a => new AccountDtos
                {
                    AccountID = a.AccountID,
                    Username = a.Username,
                    Email = a.Email
                })
                .FirstOrDefaultAsync();

            return account;
        }

        // Get all accounts
        public async Task<IEnumerable<AccountDtos>> GetAllAccountsAsync()
        {
            return await _context.Accounts
                .Select(a => new AccountDtos
                {
                    AccountID = a.AccountID,
                    Username = a.Username,
                    Email = a.Email
                })
                .ToListAsync();
        }

        // Create new account
        public async Task<Account> CreateAccountAsync(Account addAccount)
        {
            var account = new Account
            {
                Username = addAccount.Username,
                Email = addAccount.Email,
                Password = BCrypt.Net.BCrypt.HashPassword(addAccount.Password) // Hash password before saving
            };

            _context.Accounts.Add(account);
            await _context.SaveChangesAsync();

            return new Account
            {
                AccountID = account.AccountID,
                Username = account.Username,
                Email = account.Email,
                Password = "[HIDDEN]" // Hide password in return object for security
            };
        }

        // Update account
        public async Task<bool> UpdateAccountAsync(int id, Account updatedAccount)
        {
            var account = await _context.Accounts.FindAsync(id);
            if (account == null) return false;

            account.Username = updatedAccount.Username;
            account.Email = updatedAccount.Email;

            // Only update password if provided
            if (!string.IsNullOrWhiteSpace(updatedAccount.Password))
            {
                account.Password = BCrypt.Net.BCrypt.HashPassword(updatedAccount.Password);
            }

            await _context.SaveChangesAsync();
            return true;
        }

        // Delete account
        public async Task<bool> DeleteAccountAsync(int id)
        {
            var account = await _context.Accounts.FindAsync(id);
            if (account == null) return false;

            _context.Accounts.Remove(account);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
