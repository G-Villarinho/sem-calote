package http

import (
	"net/http"

	"github.com/g-villarinho/sem-calote/api/config"
	"github.com/g-villarinho/sem-calote/api/internal/handlers"
	"github.com/labstack/echo/v4"
)

func SetupRoutes(e *echo.Echo, friendHandler handlers.FriendHandler, subscriptionHandler handlers.SubscriptionHandler) {
	group := e.Group("/api/v1")

	if config.Env.Env == config.EnvDevelopment {
		setupInternalRoutes(group)
	}

	setupFriendRoutes(group, friendHandler)
	setupSubscriptionRoutes(group, subscriptionHandler)
}

func setupInternalRoutes(group *echo.Group) {
	group.GET("/envs", func(c echo.Context) error {
		return c.JSON(http.StatusOK, config.Env)
	})
}

func setupFriendRoutes(group *echo.Group, h handlers.FriendHandler) {
	group.POST("/friends", h.CreateFriend)
	group.GET("/friends", h.GetAllFriends)
}

func setupSubscriptionRoutes(group *echo.Group, h handlers.SubscriptionHandler) {
	group.POST("/subscriptions", h.CreateSubscription)
	group.GET("/subscriptions", h.GetAllSubscriptions)
}
