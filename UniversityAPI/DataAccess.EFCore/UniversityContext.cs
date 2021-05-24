using Entities.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace DataAccess.EFCore
{
    public class UniversityContext : DbContext
    {
        public UniversityContext(DbContextOptions<UniversityContext> options) : base(options)
        {
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // configure FK-RK (Assignment-Course) here
            modelBuilder
            .Entity<Assignment>()
            .HasOne(e => e.Course)
            .WithMany(e => e.Assignments)
            .OnDelete(DeleteBehavior.ClientCascade);

            // configure FK-RK (Assignment-Faculty) in the type defination itself
            // i.e.
            /*
            // this code in Assignment.cs file
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

            ////////////////// 
            // this code in Faculty.cs file
            public ICollection<Assignment> Assignments { get; set; }
            */
        }

        public DbSet<Department> Departments { get; set; }
        public DbSet<Faculty> Faculties { get; set; }
        public DbSet<Assignment> Assignments { get; set; }
        public DbSet<AsmtUpload> AsmtUploads { get; set; }
        public DbSet<Course> Courses { get; set; }
    }
}
