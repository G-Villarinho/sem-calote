package handlers

import (
	"log/slog"
	"net/http"

	"github.com/g-villarinho/sem-calote/api/internal/models"
	"github.com/g-villarinho/sem-calote/api/internal/services"
	"github.com/labstack/echo/v4"
)

type FamilyHandler interface {
	CreateFamily(ectx echo.Context) error
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

func (h *familyHandler) CreateFamily(ectx echo.Context) error {
	logger := slog.With(
		"handler", "family",
		"method", "CreateFamily",
	)

	subscriptionID := ectx.Param("subscriptionId")

	var payload models.CreateFamilyPayload
	if err := ectx.Bind(&payload); err != nil {
		logger.Error("bind payload", "error", err)
		return echo.ErrBadRequest
	}

	family, err := payload.ToFamily(subscriptionID)
	if err != nil {
		logger.Error("create family", "error", err)
		return echo.ErrBadRequest
	}

	if err := h.fs.CreateFamily(ectx.Request().Context(), family); err != nil {
		logger.Error("create family", "error", err)
		return echo.ErrInternalServerError
	}

	return ectx.NoContent(http.StatusOK)
}
