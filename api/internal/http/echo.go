package http

import (
	"fmt"

	"github.com/g-villarinho/sem-calote/api/config"
	"github.com/g-villarinho/sem-calote/api/internal/handlers"
	"github.com/g-villarinho/sem-calote/api/internal/handlers/middlewares"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

type EchoServer struct {
	e    *echo.Echo
	port string
}

func NewEchoServer(friendHandler handlers.FriendHandler, subscriptionHandler handlers.SubscriptionHandler) *EchoServer {
	e := echo.New()

	e.Use(middlewares.CORS(config.Env.API.AllowOrigins))
	e.Use(middleware.RequestID())
	e.Use(middleware.Recover())

	SetupRoutes(e, friendHandler, subscriptionHandler)
	return &EchoServer{
		e:    e,
		port: fmt.Sprintf(":%d", config.Env.API.Port),
	}
}

func (s *EchoServer) Start() {
	s.e.Logger.Fatal(s.e.Start(s.port))
}
