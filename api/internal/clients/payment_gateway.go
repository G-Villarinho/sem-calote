package clients

import (
	"context"

	"github.com/google/uuid"
)

type PaymentGatewayClient interface {
	CreatePaymentLink(ctx context.Context, input CreatePaymentLinkInput) (string, error)
}

type CreatePaymentLinkInput struct {
	ProductID uuid.UUID
	Title     string
	UnitPrice float64
}
