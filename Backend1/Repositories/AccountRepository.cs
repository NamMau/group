using Backend1.Data;
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

        public async Task<AccountDto> GetAccountByIdAsync(int id)
        {
            var account = await _context.Accounts
                .Where(a => a.AccountID == id)
                .Select(a => new AccountDto
                {
                    AccountID = a.AccountID,
                    Username = a.Username,
                    Email = a.Email
                })
                .FirstOrDefaultAsync();

            return account;
        }

        public async Task<IEnumerable<AccountDto>> GetAllAccountsAsync()
        {
            return await _context.Accounts
                .Select(a => new AccountDto
                {
                    AccountID = a.AccountID,
                    Username = a.Username,
                    Email = a.Email
                })
                .ToListAsync();
        }
    }
}
