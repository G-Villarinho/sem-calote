package handlers

import (
	"log/slog"
	"net/http"

	"github.com/g-villarinho/sem-calote/api/internal/models"
	"github.com/g-villarinho/sem-calote/api/internal/services"
	"github.com/labstack/echo/v4"
)

type FriendHandler interface {
	CreateFriend(ectx echo.Context) error
	GetAllFriends(ectx echo.Context) error
	DeleteFriend(ectx echo.Context) error
	UpdateFriend(ectx echo.Context) error
}

type friendHandler struct {
	fs services.FriendService
}

func NewFriendHandler(
	friendService services.FriendService) FriendHandler {
	return &friendHandler{
		fs: friendService,
	}
}

func (h *friendHandler) CreateFriend(ectx echo.Context) error {
	logger := slog.With(
		slog.String("handler", "employee"),
		slog.String("method", "CreateEmployee"),
	)

	var payload models.FriendPayload
	if err := ectx.Bind(&payload); err != nil {
		logger.Warn("bind payload", slog.Any("error", err))
		return echo.ErrBadRequest
	}

	friend := payload.ToFriend()

	resp, err := h.fs.CreateFriend(ectx.Request().Context(), friend)
	if err != nil {
		if err == models.ErrAlreadyExists {
			logger.Warn("friend already exists", slog.Any("error", err))
			return echo.ErrConflict
		}

		logger.Error("create friend", slog.Any("error", err))
		return echo.ErrInternalServerError
	}

	return ectx.JSON(http.StatusCreated, resp)
}

func (h *friendHandler) GetAllFriends(ectx echo.Context) error {
	logger := slog.With(
		slog.String("handler", "friend"),
		slog.String("method", "GetAllFriends"),
	)

	friends, err := h.fs.GetAllFriends(ectx.Request().Context())
	if err != nil {
		logger.Error("get all friends", slog.Any("error", err))
		return echo.ErrInternalServerError
	}

	return ectx.JSON(http.StatusOK, friends)
}

func (h *friendHandler) DeleteFriend(ectx echo.Context) error {
	logger := slog.With(
		slog.String("handler", "friend"),
		slog.String("method", "DeleteFriend"),
	)

	id := ectx.Param("friendId")
	if id == "" {
		logger.Warn("missing friend ID")
		return echo.ErrBadRequest
	}

	if err := h.fs.DeleteFriendByID(ectx.Request().Context(), id); err != nil {
		if err == models.ErrFriendNotFound {
			logger.Warn("friend not found", slog.Any("error", err))
			return echo.ErrNotFound
		}

		logger.Error("delete friend", slog.Any("error", err))
		return echo.ErrInternalServerError
	}

	return ectx.NoContent(http.StatusNoContent)
}

func (h *friendHandler) UpdateFriend(ectx echo.Context) error {
	logger := slog.With(
		slog.String("handler", "friend"),
		slog.String("method", "UpdateFriend"),
	)

	id := ectx.Param("friendId")
	if id == "" {
		logger.Warn("missing friend ID")
		return echo.ErrBadRequest
	}

	var payload models.FriendPayload
	if err := ectx.Bind(&payload); err != nil {
		logger.Warn("bind payload", slog.Any("error", err))
		return echo.ErrBadRequest
	}

	friend := payload.ToFriend()
	resp, err := h.fs.UpdateFriend(ectx.Request().Context(), id, friend)
	if err != nil {
		if err == models.ErrFriendNotFound {
			logger.Warn("friend not found", slog.Any("error", err))
			return echo.ErrNotFound
		}

		if err == models.ErrAlreadyExists {
			logger.Warn("friend already exists", slog.Any("error", err))
			return echo.ErrConflict
		}

		logger.Error("update friend", slog.Any("error", err))
		return echo.ErrInternalServerError
	}

	return ectx.JSON(http.StatusOK, resp)
}
