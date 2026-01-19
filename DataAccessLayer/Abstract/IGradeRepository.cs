using Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccessLayer.Abstract
{
    public interface IGradeRepository : IGenericRepository<Grade>
    {
        List<Grade> GetGradesByStudentId(int studentId);
    }
}
