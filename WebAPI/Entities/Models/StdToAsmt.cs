using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;
using System.Text.Json.Serialization;

namespace Entities.Models
{
    public class StdToAsmt
    {
        [Key]
        [Required]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int StdToAsmtId { get; set; }

        [Required]
        [ForeignKey(nameof(Student))]
        public int StudentId { get; set; }
        [JsonIgnore]
        public Student Student { get; set; }     

        [Required]
        [ForeignKey(nameof(Assignment))]
        public int AssignmentId { get; set; }
        [JsonIgnore]
        public Assignment Assignment { get; set; }

        public AsmtLinkStatus AsmtLinkStatus { get; set; }

        public string AsmtSubmitFilePath { get; set; }
        public string AsmtSubmitFileName { get; set; }
        public DateTime AsmtSubmitDate { get; set; }

    }
}
