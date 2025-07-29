using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace maize_drs_backend.Models
{
    public class ApplicationUser
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        [BsonElement("email")]
        public string Email { get; set; }

        [BsonElement("passwordHash")]
        public string PasswordHash { get; set; }

        // Optional: role, if you want basic role-based auth
        [BsonElement("role")]
        public string Role { get; set; } = "User";
    }
}
