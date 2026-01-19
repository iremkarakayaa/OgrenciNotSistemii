using BusinessLayer.Constants;
using Entity;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLayer.ValidationRules
{
    public class StudentValidator : AbstractValidator<Student>
    {
        public StudentValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage(Messages.StudentNameNotEmpty)
                .MinimumLength(2).WithMessage(Messages.StudentNameMinLength);

            RuleFor(x => x.Surname)
                .NotEmpty().WithMessage(Messages.StudentSurnameNotEmpty)
                .MinimumLength(2).WithMessage(Messages.StudentSurnameMinLength);

            RuleFor(x => x.StudentNumber)
                .NotEmpty().WithMessage(Messages.StudentNumberRequired)
                .Length(4, 10).WithMessage(Messages.StudentNumberLength)
                .Matches("^[0-9]+$").WithMessage(Messages.StudentNumberFormat);
        }
    }
}
