using Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLayer.Abstract
{
    public interface IGradeService
    {
        void TAdd(Grade t);
        void TDelete(Grade t);
        void TUpdate(Grade t);
        List<Grade> TGetList();
        Grade TGetById(int id);

        List<Grade> GetGradesByStudentId(int studentId);
    }
}
