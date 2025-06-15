package handlers

import (
	"errors"
	"log/slog"
	"net/http"

	"github.com/g-villarinho/sem-calote/api/internal/models"
	"github.com/g-villarinho/sem-calote/api/internal/services"
	"github.com/labstack/echo/v4"
)

type FamilyHandler interface {
	AddFamilyMember(ectx echo.Context) error
	RemoveFamilyMember(ectx echo.Context) error
}

type familyHandler struct {
	fs services.FamilyService
}

func NewFamilyHandler(
	familyService services.FamilyService) FamilyHandler {
	return &familyHandler{
		fs: familyService,
	}
}

func (h *familyHandler) AddFamilyMember(ectx echo.Context) error {
	logger := slog.With(
		"handler", "family",
		"method", "AddFamilyMember",
	)

	subscriptionID := ectx.Param("subscriptionId")

	var payload models.AddFamilyMembersPayload
	if err := ectx.Bind(&payload); err != nil {
		logger.Error("bind payload", "error", err)
		return echo.ErrBadRequest
	}

	families, err := payload.ToFamilies(subscriptionID)
	if err != nil {
		logger.Error("create family", "error", err)
		return echo.ErrBadRequest
	}

	if err := h.fs.AddFamilyMembers(ectx.Request().Context(), families); err != nil {
		if errors.Is(err, models.ErrSubscriptionNotFound) {
			logger.Error("create families failed", "reason", "subscription not found", "error", err)
			return echo.NewHTTPError(http.StatusNotFound, "Subscription not found")
		}

		if errors.Is(err, models.ErrFriendNotFound) {
			logger.Error("create families failed", "reason", "friend not found", "error", err)
			return echo.NewHTTPError(http.StatusNotFound, "One or more friends not found")
		}

		logger.Error("create families failed", "error", err)
		return echo.ErrInternalServerError
	}

	return ectx.NoContent(http.StatusOK)
}

func (h *familyHandler) RemoveFamilyMember(ectx echo.Context) error {
	logger := slog.With(
		"handler", "family",
		"method", "RemoveFamilyMember",
	)

	subscriptionID := ectx.Param("subscriptionId")

	var payload models.AddFamilyMembersPayload
	if err := ectx.Bind(&payload); err != nil {
		logger.Error("bind payload", "error", err)
		return echo.ErrBadRequest
	}

	if err := h.fs.RemoveFamilyMembers(ectx.Request().Context(), subscriptionID, payload.FriendIDs); err != nil {
		if err == models.ErrFamilyAssociationNotFound {
			logger.Error("remove family member", "error", err)
			return echo.ErrNotFound
		}

		logger.Error("remove family member", "error", err)
		return echo.ErrInternalServerError
	}

	return ectx.NoContent(http.StatusOK)
}
