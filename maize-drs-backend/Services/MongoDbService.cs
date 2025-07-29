using maize_drs_backend.Config;
using maize_drs_backend.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace maize_drs_backend.Services
{
    public class MongoDbService
    {
        private readonly IMongoDatabase _database;
        private readonly MongoDbSettings _settings;

        public MongoDbService(IOptions<MongoDbSettings> mongoOptions)
        {
            _settings = mongoOptions.Value;
            var client = new MongoClient(_settings.ConnectionString);
            _database = client.GetDatabase(_settings.DatabaseName);
        }

        public IMongoCollection<ApplicationUser> GetUserCollection()
        {
            return _database.GetCollection<ApplicationUser>("Users");
        }

        public IMongoCollection<Assessment> GetAssessmentCollection()
        {
            return _database.GetCollection<Assessment>(_settings.AssessmentCollectionName);
        }
    }
}
