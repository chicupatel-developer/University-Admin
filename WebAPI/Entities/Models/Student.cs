using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Entities.Models
{
    public class Student
    {
        [Key]
        [Required]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int StudentId { get; set; }
        [Required(ErrorMessage = "First Name is required")]
        public string FirstName { get; set; }
        [Required(ErrorMessage = "Last Name is required")]
        public string LastName { get; set; }

        [Required(ErrorMessage = "Email is required")]
        public string Email { get; set; }
        public Gender Gender { get; set; }
        public string PhoneNumber { get; set; }

        public string HomeAddress { get; set; }
        public string MailAddress { get; set; }
        public string HomePostalCode { get; set; }
        public string MailPostalCode { get; set; }
        
        public ICollection<StdToCourse> StdsToCourses { get; set; }
        public ICollection<StdToAsmt> StdsToAsmts { get; set; }

        // this column connect ApplicationUser to Student
        public string StudentUserId { get; set; }
    }
}
