using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using maize_drs_backend.Models;
using maize_drs_backend.Services;
using maize_drs_backend.Config;
using Microsoft.AspNetCore.Authentication.JwtBearer;




var builder = WebApplication.CreateBuilder(args);

// Add controller support
builder.Services.AddControllers(); 
// Bind MongoDb settings
builder.Services.Configure<MongoDbSettings>(
    builder.Configuration.GetSection("MongoDb"));

// Register AssessmentService
builder.Services.AddSingleton<AssessmentService>();
builder.Services.AddScoped<AssessmentService>();
builder.Services.AddSingleton<MongoDbService>();

// Enable CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});


// Register JWT Service
builder.Services.AddScoped<JwtService>();

// Read JWT settings from config
var jwtKey = builder.Configuration["Jwt:Key"] ?? "ThisIsASecretKeyForJwtToken123!";
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "maize-drs-api";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "maize-drs-client";

// Add JWT Authentication
builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer("Bearer", options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtKey))
        };

        options.Events = new JwtBearerEvents
        {
            OnChallenge = context =>
            {
                context.HandleResponse();
                context.Response.StatusCode = 401;
                context.Response.ContentType = "application/json";
                return context.Response.WriteAsync("{\"error\":\"Unauthorized\"}");
            }
        };
    });

builder.Services.AddAuthorization();

// Enable Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Swagger UI (dev only)
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Auth + Middleware pipeline
app.UseHttpsRedirection();
app.UseCors("AllowAll");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();