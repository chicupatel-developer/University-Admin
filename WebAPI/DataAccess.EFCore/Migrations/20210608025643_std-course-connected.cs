using Microsoft.EntityFrameworkCore.Migrations;

namespace DataAccess.EFCore.Migrations
{
    public partial class stdcourseconnected : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_StdsToCourses_CourseId",
                table: "StdsToCourses",
                column: "CourseId");

            migrationBuilder.CreateIndex(
                name: "IX_StdsToCourses_StudentId",
                table: "StdsToCourses",
                column: "StudentId");

            migrationBuilder.AddForeignKey(
                name: "FK_StdsToCourses_Courses_CourseId",
                table: "StdsToCourses",
                column: "CourseId",
                principalTable: "Courses",
                principalColumn: "CouseId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_StdsToCourses_Students_StudentId",
                table: "StdsToCourses",
                column: "StudentId",
                principalTable: "Students",
                principalColumn: "StudentId",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StdsToCourses_Courses_CourseId",
                table: "StdsToCourses");

            migrationBuilder.DropForeignKey(
                name: "FK_StdsToCourses_Students_StudentId",
                table: "StdsToCourses");

            migrationBuilder.DropIndex(
                name: "IX_StdsToCourses_CourseId",
                table: "StdsToCourses");

            migrationBuilder.DropIndex(
                name: "IX_StdsToCourses_StudentId",
                table: "StdsToCourses");
        }
    }
}
