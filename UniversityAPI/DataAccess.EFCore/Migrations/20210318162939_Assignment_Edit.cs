using Microsoft.EntityFrameworkCore.Migrations;

namespace DataAccess.EFCore.Migrations
{
    public partial class Assignment_Edit : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AsmtUploadId",
                table: "Assignments",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AsmtUploadId",
                table: "Assignments");
        }
    }
}
