using Microsoft.EntityFrameworkCore.Migrations;

namespace DataAccess.EFCore.Migrations
{
    public partial class studenttableedit : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "HomeAddress",
                table: "Students",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "HomePostalCode",
                table: "Students",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MailAddress",
                table: "Students",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MailPostalCode",
                table: "Students",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "HomeAddress",
                table: "Students");

            migrationBuilder.DropColumn(
                name: "HomePostalCode",
                table: "Students");

            migrationBuilder.DropColumn(
                name: "MailAddress",
                table: "Students");

            migrationBuilder.DropColumn(
                name: "MailPostalCode",
                table: "Students");
        }
    }
}
