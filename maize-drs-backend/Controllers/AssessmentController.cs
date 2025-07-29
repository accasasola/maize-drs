using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using maize_drs_backend.Models;
using maize_drs_backend.Services;

[ApiController]
[Route("api/[controller]")]
public class AssessmentController : ControllerBase
{
    private readonly AssessmentService _service;

    public AssessmentController(AssessmentService service)
    {
        _service = service;
    }

    [Authorize]
    [HttpPost("submit")]
    public async Task<IActionResult> SubmitAssessment([FromBody] AssessmentDto dto)
    {
        var email = User.Identity?.Name;
        if (string.IsNullOrEmpty(email)) return Unauthorized();

        var assessment = new Assessment
        {
            ImageName = dto.ImageName,
            Base64Image = dto.Base64Image,
            CropStage = dto.CropStage,
            LeafFeeding = dto.LeafFeeding,
            ShotHoles = dto.ShotHoles,
            Lesions = dto.Lesions,
            LarvaeCount = dto.LarvaeCount,
            Score = dto.Score,
            Description = dto.Description,
            Email = email
        };

        await _service.CreateAsync(assessment);
        return Ok(new { message = "Assessment saved to MongoDB successfully" });
    }
}
