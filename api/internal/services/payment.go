package services

import (
	"context"

	"github.com/g-villarinho/sem-calote/api/config"
	"github.com/g-villarinho/sem-calote/api/internal/clients"
	"github.com/g-villarinho/sem-calote/api/internal/models"
	"github.com/g-villarinho/sem-calote/api/internal/repositories"
)

type PaymentService interface {
	CreatePayment(ctx context.Context, input models.CreatePaymentInput) (*models.Payment, error)
}

type paymentService struct {
	paymentGateway clients.PaymentGatewayClient
	paymentRepo    repositories.PaymentRepository
}

func NewPaymentService(
	paymentGateway clients.PaymentGatewayClient,
	paymentRepo repositories.PaymentRepository) PaymentService {
	return &paymentService{
		paymentGateway: paymentGateway,
		paymentRepo:    paymentRepo,
	}
}

func (p *paymentService) CreatePayment(ctx context.Context, input models.CreatePaymentInput) (*models.Payment, error) {
	tax := config.Env.MercadoPago.PixFeePercentage / 100.0
	unitPrice := float64(input.OriginalPriceInCents) / (1 - tax)

	createPaymentLinkInput := clients.CreatePaymentLinkInput{
		ProductID: input.SubscriptionID,
		Title:     input.Title,
		UnitPrice: unitPrice,
	}

	paymentLink, err := p.paymentGateway.CreatePaymentLink(ctx, createPaymentLinkInput)
	if err != nil {
		return nil, err
	}

	payment := &models.Payment{
		AmountInCents:  int64(input.OriginalPriceInCents * 100),
		Status:         models.PaymentStatusPending,
		PaymentLink:    paymentLink,
		SubscriptionID: input.SubscriptionID,
		FriendID:       input.FriendID,
	}

	if err := p.paymentRepo.CreatePayment(ctx, payment); err != nil {
		return nil, err
	}

	return payment, nil
}
