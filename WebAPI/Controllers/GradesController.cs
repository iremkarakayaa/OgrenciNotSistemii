using BusinessLayer.Abstract;
using Entity;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GradesController : ControllerBase
    {
        private readonly IGradeService _gradeService;

        public GradesController(IGradeService gradeService)
        {
            _gradeService = gradeService;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var values = _gradeService.TGetList();
            return Ok(values);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var value = _gradeService.TGetById(id);
            if (value == null) return NotFound();
            return Ok(value);
        }

        [HttpGet("GetByStudentId/{studentId}")]
        public IActionResult GetByStudentId(int studentId)
        {
            var values = _gradeService.GetGradesByStudentId(studentId);
            return Ok(values);
        }

        [HttpPost]
        public IActionResult Add(Grade grade)
        {
            try
            {
                _gradeService.TAdd(grade);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var value = _gradeService.TGetById(id);
            if (value == null) return NotFound();

            _gradeService.TDelete(value);
            return Ok();
        }

        [HttpPut]
        public IActionResult Update(Grade grade)
        {
            try
            {
                _gradeService.TUpdate(grade);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
