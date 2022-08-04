using System;
using System.Collections.Generic;
using System.Text;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Entities.Models
{
    public class Department
    {
        [Key]
        [Required]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int DepartmentId { get; set; }

        [Required(ErrorMessage = "Department Name is required")]
        public string DepartmentName { get; set; }
        public ICollection<Faculty> Faculties { get; set; }
        public ICollection<Course> Courses { get; set; }
    }
}
