using BusinessLayer.Abstract;
using DataAccessLayer.Abstract;
using Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BusinessLayer.Constants;

namespace BusinessLayer.Concrete
{
    public class GradeManager : IGradeService
    {
        private readonly IGradeRepository _gradeRepository;

        public GradeManager(IGradeRepository gradeRepository)
        {
            _gradeRepository = gradeRepository;
        }

        public void TAdd(Grade t)
        {
            var dersZatenVarMi = _gradeRepository.GetListAll(x =>
                x.StudentId == t.StudentId &&
                 x.LessonId == t.LessonId &&
                 x.DeletedAt == null
             );

            if (dersZatenVarMi.Count > 0)
            {
                throw new Exception(Messages.LessonAlreadyAssigned);
            }
            _gradeRepository.Insert(t);
        }

        public void TDelete(Grade t)
        {
            _gradeRepository.Delete(t);
        }

        public Grade TGetById(int id)
        {
            return _gradeRepository.GetById(id);
        }

        public List<Grade> TGetList()
        {
            return _gradeRepository.GetListAll(x => x.DeletedAt == null);
        }

        public void TUpdate(Grade t)
        {
            _gradeRepository.Update(t);
        }

        
        public List<Grade> GetGradesByStudentId(int studentId)
        {

            return _gradeRepository.GetGradesByStudentId(studentId);
        }
    }
}
