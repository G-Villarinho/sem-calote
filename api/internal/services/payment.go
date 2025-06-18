package services

import (
	"context"

	"github.com/g-villarinho/sem-calote/api/internal/models"
	"github.com/g-villarinho/sem-calote/api/internal/repositories"
)

type PaymentService interface {
	CreatePayment(ctx context.Context, input models.CreatePaymentInput) (*models.Payment, error)
}

type paymentService struct {
	paymentRepo repositories.PaymentRepository
}

func NewPaymentService(
	paymentRepo repositories.PaymentRepository) PaymentService {
	return &paymentService{
		paymentRepo: paymentRepo,
	}
}

func (p *paymentService) CreatePayment(ctx context.Context, input models.CreatePaymentInput) (*models.Payment, error) {
	payment := &models.Payment{
		AmountInCents:  input.PriceInCents,
		Status:         models.PaymentStatusPending,
		SubscriptionID: input.SubscriptionID,
		FriendID:       input.FriendID,
	}

	if err := p.paymentRepo.CreatePayment(ctx, payment); err != nil {
		return nil, err
	}

	return payment, nil
}
