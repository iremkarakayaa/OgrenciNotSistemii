using Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entity
{
    public class Grade : BaseEntity
    {
        public int? StudentId { get; set; }  //foreign key
        public Student? Student { get; set; }  //Navigation Property


        public int LessonId { get; set; }
        public Lesson? Lesson { get; set; }

        public int? ExamScore { get; set; }
    }
}
