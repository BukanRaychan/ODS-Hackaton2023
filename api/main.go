package main

import (
	"fmt"
	"log"
	"os"

	"github.com/Data-Alchemist-ODS/ods-api/database"
	"github.com/Data-Alchemist-ODS/ods-api/routes"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors" // Import the CORS middleware
	"github.com/joho/godotenv"

	"net/http"
)

func main() {
	// Read env
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal(err)
	}

	// Create a file server to serve static files from the "static" folder
	fs := http.FileServer(http.Dir("static"))

	// Handle requests to the root URL ("/") by serving the index.html file
	http.Handle("/", fs)

	// Connect to database
	database.ConnectDB()

	defer database.DisconnectDB()

	// Initialize Fiber
	app := fiber.New()

	// Add CORS middleware
	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://127.0.0.1:5500", // Replace this with your frontend URL
	}))

	// Routes
	routes.RouteInit(app)

	//handle unavailable route
	app.Use(func(c *fiber.Ctx) error {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "Route not found",
			"status":  fiber.StatusNotFound,
		})
	})

	// Run server on specified host and port
	host := os.Getenv("HOST")
	port := os.Getenv("PORT")
	fmt.Println("\nServer running on", host+":"+port)

	err = app.Listen(host + ":" + port)
	if err != nil {
		log.Fatal(err)
	}
}
