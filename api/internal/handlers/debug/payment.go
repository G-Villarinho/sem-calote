package debug

import (
	"fmt"

	"github.com/g-villarinho/sem-calote/api/internal/models"
	"github.com/g-villarinho/sem-calote/api/internal/repositories"
	"github.com/g-villarinho/sem-calote/api/internal/services"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

type PaymentDebugHandler interface {
	CreatePaymentDebug(ectx echo.Context) error
}

type paymentDebugHandler struct {
	paymentService   services.PaymentService
	subscriptionRepo repositories.SubscriptionRepository
}

func NewPaymentDebugHandler(
	paymentService services.PaymentService,
	subscriptionRepo repositories.SubscriptionRepository) PaymentDebugHandler {
	return &paymentDebugHandler{
		paymentService:   paymentService,
		subscriptionRepo: subscriptionRepo,
	}
}

func (h *paymentDebugHandler) CreatePaymentDebug(ectx echo.Context) error {
	subscriptionID := ectx.QueryParam("subscriptionId")
	friendIDStr := ectx.QueryParam("friendId")

	if subscriptionID == "" || friendIDStr == "" {
		return ectx.JSON(400, map[string]string{
			"error": "subscriptionId and friendId query parameters are required",
		})
	}

	friendID, err := uuid.Parse(friendIDStr)
	if err != nil {
		return ectx.JSON(400, map[string]string{
			"error": "invalid friendId format",
		})
	}

	subscription, err := h.subscriptionRepo.GetSubscriptionByID(ectx.Request().Context(), subscriptionID, false)
	if err != nil {
		return ectx.JSON(500, map[string]string{
			"error": "failed to retrieve subscription",
		})
	}

	input := models.CreatePaymentInput{
		SubscriptionID:       subscription.ID,
		FriendID:             friendID,
		OriginalPriceInCents: subscription.TotalPriceInCents,
		Title:                fmt.Sprintf("Debug Payment for %s", subscription.Name),
	}

	payment, err := h.paymentService.CreatePayment(ectx.Request().Context(), input)
	if err != nil {
		return err
	}

	return ectx.JSON(200, payment.PaymentLink)
}
