package http

import (
	"net/http"

	"github.com/g-villarinho/sem-calote/api/config"
	"github.com/g-villarinho/sem-calote/api/internal/handlers"
	"github.com/g-villarinho/sem-calote/api/internal/handlers/debug"
	"github.com/labstack/echo/v4"
)

func SetupRoutes(
	e *echo.Echo,
	friendHandler handlers.FriendHandler,
	subscriptionHandler handlers.SubscriptionHandler,
	familyHandler handlers.FamilyHandler,
	paymentDebugHandler debug.PaymentDebugHandler) {
	group := e.Group("/api/v1")

	if config.Env.Env == config.EnvDevelopment {
		setupInternalRoutes(group, paymentDebugHandler)
	}

	setupFriendRoutes(group, friendHandler)
	setupSubscriptionRoutes(group, subscriptionHandler)
	setupFamilyRoutes(group, familyHandler)
}

func setupInternalRoutes(group *echo.Group, paymentDebugHandler debug.PaymentDebugHandler) {
	group.GET("/envs", func(c echo.Context) error {
		return c.JSON(http.StatusOK, config.Env)
	})

	group.POST("/debug/payment/:subscriptionId/:friendId", paymentDebugHandler.CreatePaymentDebug)
}

func setupFriendRoutes(group *echo.Group, h handlers.FriendHandler) {
	group.POST("/friends", h.CreateFriend)
	group.GET("/friends", h.GetAllFriends)
	group.DELETE("/friends/:friendId", h.DeleteFriend)
	group.PUT("/friends/:friendId", h.UpdateFriend)
}

func setupSubscriptionRoutes(group *echo.Group, h handlers.SubscriptionHandler) {
	group.POST("/subscriptions", h.CreateSubscription)
	group.GET("/subscriptions", h.GetAllSubscriptions)
	group.GET("/subscriptions/:subscriptionId", h.GetSubscription)
	group.DELETE("/subscriptions/:subscriptionId", h.DeleteSubscription)
	group.PUT("/subscriptions/:subscriptionId", h.UpdateSubscription)
}

func setupFamilyRoutes(group *echo.Group, h handlers.FamilyHandler) {
	group.POST("/subscriptions/:subscriptionId/family/members", h.AddFamilyMember)
	group.DELETE("/subscriptions/:subscriptionId/family/members", h.RemoveFamilyMember)
}
