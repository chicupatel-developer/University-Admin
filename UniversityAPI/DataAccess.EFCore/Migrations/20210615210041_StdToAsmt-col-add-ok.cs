using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace DataAccess.EFCore.Migrations
{
    public partial class StdToAsmtcoladdok : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "AsmtSubmitDate",
                table: "StdToAsmt",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AsmtSubmitDate",
                table: "StdToAsmt");
        }
    }
}
