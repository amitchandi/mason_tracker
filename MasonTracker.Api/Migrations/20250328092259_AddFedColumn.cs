using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MasonTracker.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddFedColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Fed",
                table: "DogWalkingRecords",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Fed",
                table: "DogWalkingRecords");
        }
    }
}
