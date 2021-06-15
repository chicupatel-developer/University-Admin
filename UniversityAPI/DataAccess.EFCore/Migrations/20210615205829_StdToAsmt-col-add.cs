using Microsoft.EntityFrameworkCore.Migrations;

namespace DataAccess.EFCore.Migrations
{
    public partial class StdToAsmtcoladd : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AsmtSubmitFileName",
                table: "StdToAsmt",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "AsmtSubmitFilePath",
                table: "StdToAsmt",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AsmtSubmitFileName",
                table: "StdToAsmt");

            migrationBuilder.DropColumn(
                name: "AsmtSubmitFilePath",
                table: "StdToAsmt");
        }
    }
}
