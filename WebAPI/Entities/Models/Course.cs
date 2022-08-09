﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;
using System.Text.Json.Serialization;

namespace Entities.Models
{
    public class Course
    {
        [Key]
        [Required]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int CouseId { get; set; }

        [Required(ErrorMessage = "Course Name is required")]
        public string CouseName { get; set; }

        [Required(ErrorMessage = "Faculty is required")]
        public int FacultyId { get; set; }

        [Required(ErrorMessage = "Department is required")]
        [ForeignKey(nameof(Department))]
        public int DepartmentId { get; set; }

        [JsonIgnore]
        public Department Department { get; set; }
        public ICollection<Assignment> Assignments { get; set; }
        public ICollection<StdToCourse> StdsToCourses { get; set; }
    }
}
