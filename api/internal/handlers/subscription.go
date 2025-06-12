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
	GetSubscription(ectx echo.Context) error
	DeleteSubscription(ectx echo.Context) error
	UpdateSubscription(ectx echo.Context) error
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

	var payload models.SubscriptionPayload
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

func (h *subscriptionHandler) GetSubscription(ectx echo.Context) error {
	logger := slog.With(
		slog.String("handler", "subscription"),
		slog.String("method", "GetSubscription"),
	)

	subscriptionID := ectx.Param("subscriptionId")
	if subscriptionID == "" {
		logger.Error("missing subscription ID")
		return echo.ErrBadRequest
	}

	withFriends := ectx.QueryParam("withFriends") == "true"

	subscription, err := h.ss.GetSubscriptionByID(ectx.Request().Context(), subscriptionID, withFriends)
	if err != nil {
		logger.Error("get subscription by ID", "error", err)
		return echo.ErrInternalServerError
	}

	return ectx.JSON(http.StatusOK, subscription)
}

func (h *subscriptionHandler) DeleteSubscription(ectx echo.Context) error {
	logger := slog.With(
		slog.String("handler", "subscription"),
		slog.String("method", "DeleteSubscription"),
	)

	subscriptionID := ectx.Param("subscriptionId")
	if subscriptionID == "" {
		logger.Error("missing subscription ID")
		return echo.ErrBadRequest
	}

	if err := h.ss.DeleteSubscriptionByID(ectx.Request().Context(), subscriptionID); err != nil {
		if err == models.ErrSubscriptionNotFound {
			logger.Error("subscription not found", "error", err)
			return echo.ErrNotFound
		}
		logger.Error("delete subscription by ID", "error", err)
		return echo.ErrInternalServerError
	}

	return ectx.NoContent(http.StatusNoContent)
}

func (h *subscriptionHandler) UpdateSubscription(ectx echo.Context) error {
	logger := slog.With(
		slog.String("handler", "subscription"),
		slog.String("method", "UpdateSubscription"),
	)

	subscriptionID := ectx.Param("subscriptionId")
	if subscriptionID == "" {
		logger.Error("missing subscription ID")
		return echo.ErrBadRequest
	}

	var payload models.SubscriptionPayload
	if err := ectx.Bind(&payload); err != nil {
		logger.Error("bind payload", "error", err)
		return echo.ErrBadRequest
	}

	subscription := payload.ToSubscription()

	resp, err := h.ss.UpdateSubscription(ectx.Request().Context(), subscriptionID, subscription)
	if err != nil {
		if err == models.ErrSubscriptionNotFound {
			logger.Error("subscription not found", "error", err)
			return echo.ErrNotFound
		}
		logger.Error("update subscription", "error", err)
		return echo.ErrInternalServerError
	}

	return ectx.JSON(http.StatusOK, resp)
}
