using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
namespace Entities.Models
{
    public class Assignment
    {
        [Key]
        [Required]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int AssignmentId { get; set; }

        [Required(ErrorMessage = "Assignment Title is required")]
        public string Title { get; set; }

        [Required(ErrorMessage = "Assignment Details is required")]
        public string Details { get; set; }

        [Required]
        public DateTime AsmtCreateDate { get; set; }

        [Required(ErrorMessage = "Assignment Submission Date is required")]
        public DateTime AsmtLastDate { get; set; }

        [Required(ErrorMessage = "Faculty is required")]
        [ForeignKey(nameof(Faculty))]
        public int FacultyId { get; set; }

        // JsonException: A possible object cycle was detected which is not supported.
        // This can either be due to a cycle or if the object depth is larger than the maximum allowed depth of 32.
        [JsonIgnore]
        public Faculty Faculty { get; set; }

        public int CourseId { get; set; }
       
        [JsonIgnore]
        public Course Course { get; set; }

        public int AsmtUploadId { get; set; }

        public ICollection<StdToAsmt> StdsToAsmts { get; set; }
    }
}
