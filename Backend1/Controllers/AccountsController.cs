using Asp.Versioning;
using Backend1.Models;
using Backend1.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace Backend1.Controllers
{
    [Route("api/v{version:apiVersion}/accounts")]
    [ApiController]
    [ApiVersion("1.0")]
    [ApiVersion("2.0")]
    [ApiExplorerSettings(GroupName = "v1")]
    public class AccountsController : ControllerBase
    {
        private readonly IAccountRepository _accountRepository;

        public AccountsController(IAccountRepository accountRepository)
        {
            _accountRepository = accountRepository;
        }

        //Get account by ID
        [HttpGet("{id}")]
        [MapToApiVersion("1.0")]
        [MapToApiVersion("2.0")]
        public async Task<IActionResult> GetAccountById(int id)
        {
            var account = await _accountRepository.GetAccountByIdAsync(id);
            if (account == null)
                return NotFound(new { Message = "Account not found" });

            return Ok(account);
        }

        //Get all accounts
        [HttpGet]
        [MapToApiVersion("1.0")]
        [MapToApiVersion("2.0")]
        public async Task<IActionResult> GetAllAccounts()
        {
            var accounts = await _accountRepository.GetAllAccountsAsync();
            return Ok(accounts);
        }

        //Create a new account
        [HttpPost]
        [MapToApiVersion("1.0")]
        [MapToApiVersion("2.0")]
        public async Task<IActionResult> CreateAccount([FromBody] Account account)
        {
            if (account == null || string.IsNullOrWhiteSpace(account.Password))
                return BadRequest(new { Message = "Invalid account data" });

            var newAccount = await _accountRepository.CreateAccountAsync(account);
            return CreatedAtAction(nameof(GetAccountById), new { id = newAccount.AccountID, version = "1.0" }, newAccount);
        }

        //Update an existing account
        [HttpPut("{id}")]
        [MapToApiVersion("1.0")]
        [MapToApiVersion("2.0")]
        public async Task<IActionResult> UpdateAccount(int id, [FromBody] Account updatedAccount)
        {
            if (updatedAccount == null)
                return BadRequest(new { Message = "Invalid account data" });

            var success = await _accountRepository.UpdateAccountAsync(id, updatedAccount);
            if (!success)
                return NotFound(new { Message = "Account not found" });

            return NoContent(); // 204 No Content
        }

        //Delete an account
        [HttpDelete("{id}")]
        [MapToApiVersion("1.0")]
        [MapToApiVersion("2.0")]
        public async Task<IActionResult> DeleteAccount(int id)
        {
            var success = await _accountRepository.DeleteAccountAsync(id);
            if (!success)
                return NotFound(new { Message = "Account not found" });

            return NoContent(); // 204 No Content
        }
    }
}
