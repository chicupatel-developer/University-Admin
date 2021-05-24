using System;
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

        [Required]
        public string Title { get; set; }

        [Required]
        public string Details { get; set; }

        [Required]
        public DateTime AsmtCreateDate { get; set; }

        [Required]
        public DateTime AsmtLastDate { get; set; }

        
        [Required]
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
    }
}
