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
        [Required]
        public string FirstName { get; set; }
        [Required]
        public string LastName { get; set; }
        public ICollection<StdToCourse> StdsToCourses { get; set; }
        public ICollection<StdToAsmt> StdsToAsmts { get; set; }

        // this column connect ApplicationUser to Student
        public string StudentUserId { get; set; }
    }
}
