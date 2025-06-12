package handlers

import (
	"log/slog"
	"net/http"

	"github.com/g-villarinho/sem-calote/api/internal/models"
	"github.com/g-villarinho/sem-calote/api/internal/services"
	"github.com/labstack/echo/v4"
)

type SubscriptionHandler interface {
	CreateSubscription(ectx echo.Context) error
	GetAllSubscriptions(ectx echo.Context) error
}

type subscriptionHandler struct {
	ss services.SubscriptionService
}

func NewSubscriptionHandler(
	subscriptionService services.SubscriptionService) SubscriptionHandler {
	return &subscriptionHandler{
		ss: subscriptionService,
	}
}

func (h *subscriptionHandler) CreateSubscription(ectx echo.Context) error {
	logger := slog.With(
		slog.String("handler", "subscription"),
		slog.String("method", "CreateSubscription"),
	)

	var payload models.CreateSubscriptionPayload
	if err := ectx.Bind(&payload); err != nil {
		logger.Error("bind payload", "error", err)
		return echo.ErrBadRequest
	}

	subscription := payload.ToSubscription()

	resp, err := h.ss.CreateSubscription(ectx.Request().Context(), subscription)
	if err != nil {
		logger.Error("create subscription", "error", err)
		return echo.ErrInternalServerError
	}

	return ectx.JSON(http.StatusCreated, resp)
}

func (h *subscriptionHandler) GetAllSubscriptions(ectx echo.Context) error {
	logger := slog.With(
		slog.String("handler", "subscription"),
		slog.String("method", "GetAllSubscriptions"),
	)

	withFriends := ectx.QueryParam("withFriends") == "true"

	subscriptions, err := h.ss.GetAllSubscriptions(ectx.Request().Context(), withFriends)
	if err != nil {
		logger.Error("get all subscriptions", "error", err)
		return echo.ErrInternalServerError
	}

	return ectx.JSON(http.StatusOK, subscriptions)
}
