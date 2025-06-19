package main

import (
	"context"
	"log"
	"time"

	"github.com/g-villarinho/sem-calote/api/config"
	"github.com/g-villarinho/sem-calote/api/infra"
	"github.com/g-villarinho/sem-calote/api/internal/bootstrap"
	"github.com/g-villarinho/sem-calote/api/internal/http"
	"github.com/g-villarinho/sem-calote/api/internal/schedulers"
	"github.com/g-villarinho/sem-calote/api/pkgs"
	"go.uber.org/dig"
	"gorm.io/gorm"
)

func main() {
	if err := config.LoadEnvironment(); err != nil {
		log.Fatal("load environment", err)
	}

	container := dig.New()

	context, cancel := context.WithTimeout(context.Background(), time.Second*5)
	defer cancel()

	db, err := infra.CreateSQLiteConnection(context)
	if err != nil {
		log.Fatal("create database connection", err)
	}

	pkgs.Provide(container, func() *gorm.DB {
		return db
	})

	bootstrap.InitializeDependencyInjection(container)
	pkgs.Provide(container, http.NewEchoServer)

	schedulers.StartCronJobs(container)

	app := pkgs.Resolve[*http.EchoServer](container)
	app.Start()
}
