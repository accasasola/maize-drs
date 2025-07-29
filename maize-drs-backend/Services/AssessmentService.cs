using maize_drs_backend.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using maize_drs_backend.Config;


namespace maize_drs_backend.Services
{
    public class AssessmentService
    {
        private readonly IMongoCollection<Assessment> _assessments;

        public AssessmentService(IOptions<MongoDbSettings> settings)
        {
            var mongoClient = new MongoClient(settings.Value.ConnectionString);
            var database = mongoClient.GetDatabase(settings.Value.DatabaseName);
            _assessments = database.GetCollection<Assessment>(settings.Value.AssessmentCollectionName);
        }

        public async Task CreateAsync(Assessment assessment) =>
            await _assessments.InsertOneAsync(assessment);
    }
}
