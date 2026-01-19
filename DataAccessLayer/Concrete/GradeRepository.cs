using DataAccessLayer.Abstract;
using Entity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccessLayer.Concrete
{
    public class GradeRepository : GenericRepository<Grade>, IGradeRepository
    {
        public GradeRepository(AppDbContext context) : base(context)
        {
        }
        public List<Grade> GetGradesByStudentId(int studentId)
        {
            return _context.Grades
                .Include(x => x.Student)
                .Include(x => x.Lesson)
                .Where(x => x.StudentId == studentId && x.DeletedAt == null)
                .ToList();
        }
    }
}
