using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLayer.Constants
{
    public static class Messages
    {
   
        public static string StudentNotFound = "Öğrenci bulunamadı!";
        
        
        public static string StudentNameNotEmpty = "Öğrenci adı boş geçilemez!";
        public static string StudentNameMinLength = "Öğrenci adı en az 2 karakter olmalıdır.";

        
        public static string StudentSurnameNotEmpty = "Öğrenci soyadı boş geçilemez!";
        public static string StudentSurnameMinLength = "Öğrenci soyadı en az 2 karakter olmalıdır.";

       
        public static string StudentNumberRequired = "Öğrenci numarası zorunludur.";
        public static string StudentNumberFormat = "Öğrenci numarası sadece rakamlardan oluşmalıdır!";
        public static string StudentNumberLength = "Öğrenci numarası 4-10 karakter arasında olmalıdır!";
        public static string StudentNumberExists = "Bu öğrenci numarası ile kayıtlı başka bir öğrenci var!";

        
        public static string LessonNotFound = "Ders bulunamadı!";
        public static string LessonAlreadyAssigned = "Bu ders bu öğrenciye zaten atanmış!";

        
        public static string LessonNameNotEmpty = "Ders adı boş geçilemez!";
        public static string LessonNameMinLength = "Ders adı en az 3 karakter olmalıdır.";
        public static string LessonNameMaxLength = "Ders adı en fazla 100 karakter olabilir.";
        public static string LessonNameExists = "Bu ders adı zaten mevcut!";

      
        public static string LessonCodeNotEmpty = "Ders kodu boş geçilemez!";
        public static string LessonCodeMinLength = "Ders kodu en az 2 karakter olmalıdır.";
        public static string LessonCodeMaxLength = "Ders kodu en fazla 10 karakter olabilir.";
        public static string LessonCodeFormat = "Ders kodu sadece büyük harf ve rakamlardan oluşmalıdır!";
        public static string LessonCodeExists = "Bu ders kodu zaten mevcut!";

       
        public static string GradeNotFound = "Not kaydı bulunamadı!";
        public static string GradeRangeError = "Sınav notu 0 ile 100 arasında olmalıdır.";
        public static string GradeNotEntered = "Not değeri girilmelidir!";
    }
}
