using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Entities.Models
{
    public class Faculty
    {
        [Key]
        [Required]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int FacultyId { get; set; }

        [Required(ErrorMessage = "First Name is required")]
        public string FirstName { get; set; }

        [Required(ErrorMessage = "Last Name is required")]
        public string LastName { get; set; }

        [Required(ErrorMessage = "Email is required")]
        public string Email { get; set; }
        public Gender Gender { get; set; }

        public string PhoneNumber { get; set; }

        [Required(ErrorMessage = "Department is required")]
        [ForeignKey(nameof(Department))]
        public int DepartmentId { get; set; }

        // JsonException: A possible object cycle was detected which is not supported.
        // This can either be due to a cycle or if the object depth is larger than the maximum allowed depth of 32.
        [JsonIgnore]
        public Department Department { get; set; }
        public ICollection<Assignment> Assignments { get; set; }
    }
}
