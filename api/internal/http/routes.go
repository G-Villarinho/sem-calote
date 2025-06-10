package http

import (
	"net/http"

	"github.com/g-villarinho/sem-calote/api/config"
	"github.com/g-villarinho/sem-calote/api/internal/handlers"
	"github.com/labstack/echo/v4"
)

func SetupRoutes(e *echo.Echo, friendHandler handlers.FriendHandler) {
	group := e.Group("/api/v1")

	if config.Env.Env == config.EnvDevelopment {
		setupInternalRoutes(group)
	}

	setupFriendRoutes(group, friendHandler)
}

func setupInternalRoutes(group *echo.Group) {
	group.GET("/envs", func(c echo.Context) error {
		return c.JSON(http.StatusOK, config.Env)
	})
}

func setupFriendRoutes(group *echo.Group, friendHandler handlers.FriendHandler) {
	group.POST("/friends", friendHandler.CreateFriend)
	group.GET("/friends", friendHandler.GetAllFriends)
}
